import React from "react";

const Screen5 = ({ response }) => {
  if (!response || !response.data) {
    return null; 
  }

  const { existingCount, createdCount, failedCount } = response.data;
  console.log(existingCount,"existingProductCount")

  return (
    <div className="screenfive">
      <h4 className="text-center">Record Creation Results </h4>
      <hr />
      <div className="mt-4">
        <p className="text-center mt-2">
          [{existingCount}] records have been successfully imported.
        </p>
        <p className="text-center mt-4">
          [{createdCount}] records with duplicated EAN codes were skipped.
        </p>
        <p className="text-center mt-4">[{failedCount}] records were not created.</p>
      </div>
    </div>
  );
};

export default Screen5;
