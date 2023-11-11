import React, { useState } from "react";
import * as XLSX from "xlsx"; // Import the 'xlsx' library
import { db } from '../firebase'
import { collection, getDocs, query, where, writeBatch, doc } from "firebase/firestore";

function ExcelFileUploader() {
  const [fileData, setFileData] = useState(null);



  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

          // Initialize a Firestore batch for batch writes
          const batch = writeBatch(db);

          for (const row of sheetData) {
            const querySnapshot = await getDocs(query(collection(db, "companies"), where("name", "==", row.name)));
            if (querySnapshot.empty) {
              const newDocRef = doc(collection(db, "companies"));
              const bycottString = row.boycott.toLowerCase();
              batch.set(newDocRef, {
                name: row.name,
                boycott: bycottString === 'yes' || row.boycott === 'نعم' ? true : false,
                url: row.url,
              });
            } else {
              console.log(`Company with name "${row.name}" already exists. Skipping.`);
            }
          }

          // Commit the batch to Firestore
          await batch.commit();

          setFileData(sheetData);
          console.log("File Data as Object: ", sheetData);
          alert('Excel Sheet Data Added Successfully!');
          window.location.reload();
        } catch (error) {
          console.error("Error reading the file:", error);
        }
      };

      reader.readAsBinaryString(file);
    }
  };


  return (
    <div className="p-4 flex flex-col items-start">
      <label className="block text-lg font-medium text-gray-700">
        Upload Excel Sheet File
      </label>
      <input
        type="file"
        accept=".xls, .xlsx"
        onChange={handleFileChange}
        className="mt-2 border rounded p-2 w-[85%]"
      />
    </div>
  );
}

export default ExcelFileUploader;
