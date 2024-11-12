import React, { useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import "./index.css";
import { Form } from "react-bootstrap";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import ValidationSchema from "../../../components/Common/ValidationScema";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserManagementData } from "../../../redux/slice/UserManagementSlice";
import { createReport } from "../../../redux/slice/CreateReportGroupSlice";
import { StatusCode } from "../../../services/helper";
import ButtonLoader from "../../../components/Common/ButtonLoader";
import { toast } from "react-toastify";
import {
  fetchGroupDataById,
  updateGroupDetails,
} from "../../../redux/slice/ReportsListingSlice";
const UpdateGroupReport = () => {
  const initialValues = {
    group_name: "",
    group_member: null,
  };
  const { status, UserManagementData } = useSelector(
    (state) => state.USERMANAGEMENT
  );
  const { id } = useParams();

  const { reportstatus } = useSelector((state) => state.REPORTSDATA);
  const [search, setSearch] = useState("");
  const [finalname, setFinalName] = useState({});
  const [nameData, setNameData] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [managebutton, setManageButton] = useState();
  const {
    values,
    handleBlur,
    handleChange,
    setValues,
    errors,
    touched,
    handleSubmit,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: ValidationSchema.createreport,
    onSubmit: async (values) => {
      const res = await dispatch(updateGroupDetails({ ...values, id: id }));
      if (res.payload?.status === 200) {
        navigate("/reports");
      }
    },
  });

  const filterUsers = UserManagementData?.filter((curElm) => {
    if (
      (curElm.first_name + curElm.last_name)
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase())
    ) {
      return curElm;
    }
  });

  const addGroupHandler = (data) => {
    if (Object.keys(data).length === 0) {
      return;
    }
    const existingGroup = nameData.find(
      (curElm) => curElm.user_id === data._id
    );
    if (existingGroup) {
      toast.error("Group already exist");
      setSearch("");
      return;
    }
    const paydata = {
      user_id: data._id,
      full_name: data.first_name + data.last_name,
      assigned_role: data.assigned_role,
    };
    setNameData((prev) => [...prev, paydata]);
    setSearch("");
    setFinalName({});
    setValues({
      ...values,
      group_member: [...nameData, paydata],
    });
  };

  const getNameDataFromList = (data) => {
    setSearch(data.first_name + data.last_name);
    setFinalName(data);
  };

  const removeGroup = (groupid) => {
    const filtername = nameData.filter((curElm) => curElm.user_id !== groupid);
    setNameData(filtername);
    setValues({
      ...values,
      group_member: filtername,
    });
  };
  // useEffect(() => {
  //   dispatch(fetchGroupDataById(id));
  // }, []);
  // useEffect(() => {
  //   dispatch(fetchGroupDataById(id))
  //     .then((response) => {
  //       console.log("API Response:", response.payload); // Log the payload to the console
  //       if (response.payload) {
  //         const { group_name, group_member } = response.payload.data; // Extract relevant data
  //         console.log("Group Name:", group_name);
  //         console.log("Group Members:", group_member);
  //         setValues({
  //           ...values,
  //           group_name: group_name,
  //           group_member: group_member,
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // }, [dispatch, id, setValues, values]);
  // useEffect(() => {
  //   dispatch(fetchGroupDataById(id))
  //     .then((response) => {
  //       console.log("API Response:", response.payload); // Log the payload to the console
  //       if (response.payload) {
  //         const { group_name, group_member } = response.payload.data; // Extract relevant data
  //         console.log("Group Name:", group_name);
  //         console.log("Group Members:", group_member);
  //         setValues({
  //           ...values,
  //           group_name: group_name,
  //           group_member: group_member,
  //         });
  //         setNameData(group_member); // Update nameData state with group members
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // }, [dispatch, id, setValues, values]);
  useEffect(() => {
    console.log("useeffect call");
    dispatch(fetchGroupDataById(id))
      .then((response) => {
        console.log("API Response:", response.payload); // Log the payload to the console
        if (response.payload) {
          const { group_name, group_member } = response.payload.data; // Extract relevant data
          console.log("Group Name:", group_name);
          console.log("Group Members:", group_member);
          setValues({
            ...values,
            group_name: group_name,
            group_member: group_member,
          });
          setNameData(group_member); // Update nameData state with group members
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [dispatch, id]);

  return (
    <div className="container-fluid creategroupreport">
      <h3 className="text-center border-bottom pb-4 pt-2">
        Update Report Group
      </h3>
      <div className="pt-4">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicGroupName">
            <Form.Control
              type="text"
              name="group_name"
              value={values.group_name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Group Name"
            />
          </Form.Group>
          {errors.group_name && touched.group_name ? (
            <p className="text-danger">{errors.group_name} </p>
          ) : null}
          <div className="row">
            <div className="col-9">
              <Form.Group className="mb-3" controlId="formBasicGroupName">
                <Form.Control
                  type="text"
                  name="groupname"
                  autoComplete="off"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Form.Group>
            </div>
            <div className="col-3">
              <button
                className={`btn w-100 ${
                  search.length === 0 ? "btn-secondary" : "btn-primary"
                }`}
                type="button"
                onClick={() => addGroupHandler(finalname)}
                disabled={search.length === 0 ? true : false}
              >
                Add to Group
              </button>
            </div>
          </div>
          <div className="name_listing">
            <ul>
              {filterUsers && search && filterUsers.length > 0
                ? filterUsers.map((curElm, index) => (
                    <li
                      key={index}
                      className=""
                      onClick={() => getNameDataFromList(curElm)}
                    >
                      {curElm.first_name + " " + curElm.last_name}
                    </li>
                  ))
                : search && <p>No data found</p>}
            </ul>
          </div>
          <hr />
          <div className="row pb-3">
            <h4>In this Group</h4>

            {nameData.map((curElm, index) => (
              <div
                className="col-4 mb-3 position-relative"
                name="group_member"
                key={index}
              >
                <button
                  className={`w-100 border btn ${
                    managebutton === index + 1
                      ? "border-primary text-primary"
                      : "text-black-50"
                  }`}
                  type="button"
                  onClick={() => setManageButton(index + 1)}
                >
                  {curElm.full_name}
                </button>
                {managebutton === index + 1 && (
                  <span
                    className={`closebuttonspan ${
                      managebutton === index + 1 ? "text-primary" : ""
                    }`}
                  >
                    <IoIosCloseCircleOutline
                      className="cursor"
                      onClick={() => removeGroup(curElm.user_id)}
                      size={25}
                    />
                  </span>
                )}
              </div>
            ))}
            {errors.group_member && touched.group_member ? (
              <p className="text-danger">{errors.group_member} </p>
            ) : null}
          </div>
          <hr />

          <div className="text-end">
            <NavLink className="btn btn-dark me-4" to="/reports">
              Cancel
            </NavLink>
            <button className="btn-primary btn customsavebuttonwidth">
              {reportstatus === StatusCode.LOADING ? (
                <ButtonLoader />
              ) : (
                "Update Changes"
              )}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default UpdateGroupReport;
