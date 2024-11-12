import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import loginlogo from "../../Assets/Logo/logo.png";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { loginuser } from "../../redux/slice/LoginSlice";
import { setAuthUser } from "../../redux/slice/AuthSlice";
import { StatusCode } from "../../services/helper";
import ButtonLoader from "../../components/Common/ButtonLoader";
import ValidationSchema from "../../components/Common/ValidationScema";
import Swal from "sweetalert2";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Login = () => {
  const { status } = useSelector((state) => state.LOGIN);
  const initialValues = {
    email: "",
    password: "",
  };
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { values, errors, handleBlur, handleChange, touched, handleSubmit } =
    useFormik({
      initialValues: initialValues,
      validationSchema: ValidationSchema.login,
      onSubmit: async (values, action) => {
        // Convert email to lowercase
        const lowercaseEmail = values.email.toLowerCase();
        const response = await dispatch(
          loginuser({ ...values, email: lowercaseEmail })
        );
        console.log(response, "res from login");
        dispatch(setAuthUser(response.payload?.data));
        if (
          response?.payload.data?.role === "rm_superadmin" ||
          response?.payload?.data?.role === "rm_admin" ||
          response?.payload?.data?.role === "approver" ||
          response?.payload?.data?.role === "user" ||
          response?.payload?.data?.role === "salesrepresentative"


        ) {
          navigate("/");
        } else if (
          response?.payload?.data?.role === "distributor_superadmin" ||
          response?.payload?.data?.role === "distributor_user"
        ) {
          navigate("/distributor");
        }
        action.resetForm();
      },
    });

  return (
    <div className="container">
      <div className="row align-items-center vh-100">
        <div className="col-md-8 mx-auto">
          <div className="loginWrapper  card p-4">
            <figure className="authfigure">
              <img src={loginlogo} alt="loginlogo" />
            </figure>
            <h4 className="authheading">LOGIN FORM</h4>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter email"
                />
              </Form.Group>
              {errors.email && touched.email ? (
                <p className="text-danger">{errors.email} </p>
              ) : null}
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Password"
                  />
                  {/* Toggle button to show/hide password */}
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible />
                    ) : (
                      <AiOutlineEye />
                    )}
                  </button>
                </div>
              </Form.Group>
              {errors.password && touched.password ? (
                <p className="text-danger">{errors.password} </p>
              ) : null}
              <Button variant="primary" type="submit">
                {status === StatusCode.LOADING ? <ButtonLoader /> : "Submit"}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
