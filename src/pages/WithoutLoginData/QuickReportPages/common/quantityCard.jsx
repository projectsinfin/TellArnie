import React from "react";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { toast } from "react-toastify";

export default function QuantityCard({
  itemData,
  setData,
  DataArr,
  index,
  attr,
}) {
  return (
    <div>
      {" "}
      <div className="incidentmadeinfo mt-4">
        <h5 className="fw-bold">Equipments used in Incident</h5>
        <hr />
        <div className="equipment_incident">
          <span className="fw-bold">Used Items</span>
          <span className="fw-bold">Quantity</span>
        </div>

        <div className="mt-3 d-flex justify-content-between p-2 align-items-center">
          <div>
            <h6> {itemData?.item?.value}</h6>{" "}
            <h6> {itemData?.personOfTreatment?.value}</h6>
          </div>
          <div>
            <span>
              <CiCircleMinus
                size={36}
                onClick={() => {
                  let data = [...DataArr];
                  if (Number(data[index]?.quantity?.value) <= 1) {
                    return toast.error("Quantity not less than one");
                  }
                  data.splice(index, 1, {
                    ...data[index],
                    quantity: {
                      ...data[index].quantity,
                      value: Number(data[index]?.quantity?.value) - 1,
                    },
                  });
                  {
                    attr == "quickAdd"
                      ? setData((prev) => ({
                          ...prev,
                          formDataArray: data,
                        }))
                      : setData([...data]);
                  }
                }}
              />
            </span>
            <span className="ms-2 me-2">{itemData.quantity.value}</span>
            <span>
              <CiCirclePlus
                onClick={() => {
                  let data = [...DataArr];
                  if (Number(data[index]?.quantity?.value) <= 1) {
                    return toast.error("Quantity should not be less than one");
                  }
                  data.splice(index, 1, {
                    ...data[index],
                    quantity: {
                      ...data[index].quantity,
                      value: Number(data[index]?.quantity?.value) + 1,
                    },
                  });
                  {
                    attr == "quickAdd"
                      ? setData((prev) => ({
                          ...prev,
                          formDataArray: data,
                        }))
                      : setData([...data]);
                  }
                }}
                size={36}
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
