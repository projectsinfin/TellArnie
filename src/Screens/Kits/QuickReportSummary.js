import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import Colors from "../../Styles/Colors";
import imagePath from "../../Constant/imagePath";
import Header from "../../Components/Header";
import TextView from "../../Components/TextView";
import AllStrings from "../../Constant/AllStrings";
import navigationString from "../../Navigations/navigationString";
import kitsStyles from "./kitsStyles";
import Button from "../../Components/Button";
import MiniCard from "../../Components/MiniCard";
import ModalScreen from "../../Components/ModalScreen";
import { moderateScaleVertical } from "../../Styles/responsiveSize";
import { useDispatch, useSelector } from "react-redux";
import {
  call_AddDetailIncident,
  call_IncidentDetail_API,
  call_QuickIncident_Api,
} from "../../redux/action/IncidentReport";
import moment from "moment";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { Share } from "react-native";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import WebView from "react-native-webview";
import ImageResizer from "react-native-image-resizer";
import Loading from "../../Components/Loading";

const QuickReportSummary = ({ navigation, route }) => {
  const { key, data, id } = route.params;
  const webViewRef = useRef(null);
  const { profileDetails } = useSelector((state) => state.profileData);
  const { isLoading, error, installKitDetails } = useSelector(
    (state) => state.InstallKitsSliceDetail
  );
  const kit_id = useSelector((state) => state?.auth?.Kit_Id);

  // console.log("***********", JSON.stringify(route.params));
  // console.log("lit - id --", kit_id);
  const dispatch = useDispatch();
  // console.log("--key--", data);
  const [showModal, setShowModal] = useState(false);
  const [showModalSuccess, setshowModalSuccess] = useState(false);
  const [kitAllDetails, setKitAllDetail] = useState(null);

  const expiryDate = installKitDetails?.data.kit.expiry_date;
  const formattedDate = moment(expiryDate).format("MMM YYYY");

  const [listData, setListData] = useState(data?.listData);
  const [imageUris, setImageUris] = useState([]);
  const [isLoadings, setIsLoadings] = useState(false);

  useEffect(() => {
    setImageUris(data?.pic);
  }, []);

  useEffect(() => {
    getIncident();
  }, [id]);

  const getIncident = () => {
    dispatch(call_IncidentDetail_API(id))
      .then((res) => {
        if (res.payload.status === 200) {
          console.log("ahsdashdh----", res.payload.data);
          setKitAllDetail(res.payload.data);
        } else {
          console.log("ahh----", res.payload);
        }
      })
      .catch((err) => console.log(err));
  };

  console.log("---kitAllDetails---", JSON.stringify(kitAllDetails));
  const increaseQuantity = (index) => {
    const updatedList = [...listData];
    updatedList[index].used_quantity++;
    setListData(updatedList);
  };

  const decreaseQuantity = (index) => {
    const updatedList = [...listData];
    if (updatedList[index].used_quantity > 0) {
      updatedList[index].used_quantity--;
      setListData(updatedList);
    }
  };

  const renderItem = ({ item, index }) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 8,
      }}>
      <View style={{ flex: 0.8 }}>
        <TextView
          textSty={{
            fontSize: 12,
            textAlign: "left",
          }}>
          {item.title + " Used by " + item.full_name}
        </TextView>
      </View>

      {key == "incident" || key == "detailReportSummary" ? (
        <View
          style={{
            flex: 0.2,
            alignItems: "flex-end",
          }}>
          <TextView
            textSty={{
              fontSize: 12,
            }}>
            {item.used_quantity}
            {/* {countShow} */}
          </TextView>
        </View>
      ) : (
        <View
          style={{
            flex: 0.2,
            flexDirection: "row",
            justifyContent: "space-around",
          }}>
          <TouchableOpacity
            onPress={() => {
              decreaseQuantity(index);
            }}>
            <Image
              source={imagePath.removeIcon}
              resizeMode="contain"
              style={{ height: 18, width: 18 }}
            />
          </TouchableOpacity>
          <TextView
            textSty={{
              fontSize: 12,
              textAlign: "left",
            }}>
            {item.used_quantity}
          </TextView>
          <TouchableOpacity
            onPress={() => {
              increaseQuantity(index);
            }}>
            <Image
              source={imagePath.addIcon}
              resizeMode="contain"
              style={{ height: 18, width: 18 }}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const handleStandardReport = async () => {
    // setshowModalSuccess(true);
    setIsLoadings(true);
    const payload = new FormData();

    payload.append("item_used", JSON.stringify(data?.listData));
    var datestr = new Date(data?.date).toUTCString();
    payload.append("incident_date", datestr);
    payload.append("incident_time", data?.time);
    // payload.append("category_of_incident", data?.categoryIncident);
    // payload.append("classification", data?.classification);
    payload.append("category_of_incident", "");
    payload.append("classification", "");
    payload.append("description", data?.brief);
    payload.append(
      "incident_person",
      data?.addPersonDetail ? JSON.stringify(data?.addPersonDetail) : []
    );
    payload.append(
      "location_of_incident",
      data?.locationOfIncident?.location_name
    );
    payload.append("kit_id", installKitDetails.data.kit._id);
    payload.append("area_of_incident", data?.areaIncident);

    // Assuming this code block is within an async function

    if (Array.isArray(imageUris)) {
      // If data.pic is an array of pictures
      const resizedImages = await Promise.all(
        imageUris.map(async (picture, index) => {
          // Resize each picture using ImageResizer
          const compressedImage = await ImageResizer.createResizedImage(
            picture.uri,
            300, // Set the maximum width
            400, // Set the maximum height
            "JPEG", // Set the output format ('JPEG' or 'PNG')
            80 // Set the compression quality (0 - 100)
          );
          return {
            uri: compressedImage.uri,
            name: picture.fileName,
            type: picture.type,
          };
        })
      );

      // Append resized images to payload
      resizedImages.forEach((resizedImage) => {
        payload.append("incident_pictures", resizedImage);
      });
    } else {
      // If it's not an array, resize the single image
      if (imageUris.length !== 0) {
        const compressedImage = await ImageResizer.createResizedImage(
          imageUris[0]?.uri,
          300, // Set the maximum width
          400, // Set the maximum height
          "JPEG", // Set the output format ('JPEG' or 'PNG')
          80 // Set the compression quality (0 - 100)
        );

        // Append resized image to payload
        payload.append("incident_pictures", {
          uri: compressedImage.uri,
          name: data?.pic[0]?.fileName,
          type: data?.pic[0]?.type,
        });
      }
    }

    console.log(imageUris, "----detail report incident --- payload-", payload);
    dispatch(call_AddDetailIncident(payload))
      .then((res) => {
        if (res.payload.status) {
          console.log("standard report image", res);
          setIsLoadings(false);
          setshowModalSuccess(true);
        } else {
          setIsLoadings(false);
          console.log("status err standard report image", res);
        }
      })
      .catch((err) => {
        setIsLoadings(false);
        console.log("err standard report image", err);
      });
  };

  const handleCompleteButton = () => {
    let payloadDate = new Date(data?.date)?.toUTCString();

    let payloadList = JSON.stringify(data?.listData);
    const payload = {
      incident_date: payloadDate,
      incident_time: data?.time,
      description: data?.brief,
      classification: "",
      category_of_incident: "",
      item_used: data?.listData,
      kit_id: installKitDetails.data.kit._id,
      location_of_incident: installKitDetails?.data?.kit?.location_name,
      area_of_incident: installKitDetails?.data?.kit?.area,
    };
    console.log(payload, "post api payload");
    setIsLoadings(true);
    dispatch(call_QuickIncident_Api(payload))
      .then((res) => {
        console.log(JSON.stringify(res), "-----------then");
        if (res.payload.data.status === 200) {
          setIsLoadings(false);
          setshowModalSuccess(true);
        } else {
          setIsLoadings(false);
          console.log(res.payload.data.message);
        }
      })
      .catch((err) => {
        setIsLoadings(false);
        console.log(err);
      });
  };

  const takePicture = () => {
    launchCamera({ mediaType: "photo", multiple: true }, (response) => {
      console.log("pic reres", response);
      if (!response.didCancel) {
        const newImageUris = response.assets.map((asset) => asset);
        setImageUris((prevImageUris) => [...prevImageUris, ...newImageUris]);
      }
    });
  };

  // Function to remove an image by index from the imageUris array
  const removeImage = (indexToRemove) => {
    setImageUris((prevImageUris) =>
      prevImageUris.filter((_, index) => index !== indexToRemove)
    );
  };

  const shareContent = async () => {
    // try {
    //   // Capture the content of the WebView as an image
    //   // const uri = await captureRef(webViewRef, { format: "jpg", quality: 0.8 });

    //   // Convert the captured image to a PDF
    //   const options = {
    //     html: "<h1>Hello World</h1>", // Pass your HTML content here
    //     fileName: "converted_document",
    //     directory: "Documents",
    //   };
    //   const pdf = await RNHTMLtoPDF.convert(options);
    //   console.log("pdf----", pdf);
    //   Alert.alert("PDF Created", `PDF saved to ${pdf.filePath}`);
    // } catch (error) {
    //   console.error("Error:", error);
    //   Alert.alert("Error", "Failed to convert HTML to PDF.");
    // }
    try {
      const options = {
        html: `
        <html><head> <head>
        <style>
        .top-container {
          display: flex;
          justify-content: space-between; /* Align children with space between */
          gap: 1px; /* Gap between children */
        }
          .container {
            background-color: ${Colors.greenTint};
            // padding: 10px;
            border-radius: 5px;
            width: 100%;
          height:55px
          }
          .heading {
            font-family: 'Open Sans', sans-serif;
            font-size: 10px;
            font-weight: 700;
            line-height: 15px;
            letter-spacing: -0.011em;
            text-align: center;
            color: ${Colors.white};
          }
          .text {
            color: ${Colors.white};
            font-family: 'Open Sans', sans-serif;
            margin-top: -5px;
            font-size: 10px;
            font-weight: 400;
            line-height: 15px;
            letter-spacing: -0.011em;
            text-align: center;
           
          }
        </style>
      </head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin-left: 20px; margin-right: 20px;"> 
          <h3 style="text-align: center; font-family:OpenSans-Regular;">
            ${AllStrings.SummaryIncidentReport}
          </h3>
          <h5 style="font-family:OpenSans-Regular;">
            ${AllStrings.IncidentReportmadeby}
          </h5>
          <div style="margin-bottom: -10px;background-color: #c5c5c5;border-width: 0.5px;border-style: solid; margin-top: -8px;"></div>
          <div>
            <div style="display: flex; flex-direction: row;margin-bottom: -25px;">
              <p style="font-size: 14px; line-height: 21px; font-weight: bold;">Name:&nbsp;</p>
              <p style="font-size: 14px; line-height: 21px;">
                <!-- Insert dynamic content here -->
                ${profileDetails?.data.user_details.first_name} ${
          profileDetails?.data.user_details.last_name
        }
              </p>
            </div>


       

            ${
              // Conditionally render the contact number based on its length
              profileDetails?.data.user_details.contact_number?.length > 6
                ? `
                  <div style="display: flex; flex-direction: row;margin-bottom: -25px;">
                    <p style="font-size: 14px; line-height: 21px; font-weight: bold;">Contact Number:&nbsp;</p>
                    <p style="font-size: 14px; line-height: 21px;">${profileDetails?.data.user_details.country_code} ${profileDetails?.data.user_details.contact_number}</p>
                  </div>
                `
                : `
                  
                `
            }



            <div style="display: flex; flex-direction: row;">
              <p style="font-size: 14px; line-height: 21px; font-weight: bold;">Email:&nbsp;</p>
              <p style="font-size: 14px; line-height: 21px;">
                <!-- Insert dynamic content here -->
                ${profileDetails?.data.user_details.email}
              </p>
            </div>
        </div>

          <h5 style="font-family:OpenSans-Regular;">
            ${AllStrings.TypeIncident}
          </h5>
          <div style="margin-bottom: -10px;background-color: #c5c5c5;border-width: 0.5px;border-style: solid; margin-top: -8px;"></div>
     
          <div style="display: flex; flex-direction: row; margin-bottom: 10px;margin-bottom: -25px;">
            <p style="font-size: 14px; line-height: 21px; font-weight: bold;">Category:&nbsp </p>
            <p style="font-size: 14px; line-height: 21px;">
              <!-- Insert dynamic content here -->
              ${
                kitAllDetails?.incident?.category_of_incident ||
                data?.categoryIncident
              }
            </p>
          </div>
          <div style="display: flex; flex-direction: row; margin-bottom: 10px;margin-bottom: -25px;">
            <p style="font-size: 14px; line-height: 21px; font-weight: bold;">Classification:&nbsp </p>
            <p style="font-size: 14px; line-height: 21px; width: 80%;">
              <!-- Insert dynamic content here -->
              ${data?.classification || kitAllDetails?.incident?.classification}
            </p>
          </div>
          <div style="display: flex; flex-direction: row; margin-bottom: 10px;margin-bottom: -25px;">
            <p style="font-size: 14px; line-height: 21px; font-weight: bold;">Date:&nbsp</p>
            <p style="font-size: 14px; line-height: 21px;">
              <!-- Insert dynamic content here -->
              ${
                kitAllDetails?.incident?.incident_date
                  ? moment(kitAllDetails?.incident?.incident_date).format(
                      "DD MMM YYYY"
                    )
                  : moment(data?.date).format("DD MMM YYYY")
              }
            </p>
          </div>
          <div style="display: flex; flex-direction: row; margin-bottom: 10px;">
            <p style="font-size: 14px; line-height: 21px; font-weight: bold;">Time:&nbsp</p>
            <p style="font-size: 14px; line-height: 21px;">
              <!-- Insert dynamic content here -->
              ${data?.time || kitAllDetails?.incident?.incident_time}
            </p>
          </div>

          <div style="margin-top: 20px;">
            <div>
            <h5 style="font-family:OpenSans-Regular;">
                Summary Incident
              </h5>
              <div style="margin-bottom: -10px;background-color: #c5c5c5;border-width: 0.5px;border-style: solid; margin-top: -8px;"></div>
            </div>
            <div>
              <p style="font-size: 14px; line-height: 21px;">
                <!-- Insert dynamic content here -->
                ${data?.brief || kitAllDetails?.incident?.description}
              </p>
            </div>
          </div>

          ${
            // Conditionally render the contact number based on its length
            kitAllDetails?.incident?.incident_pictures?.length !== 0
              ? ` <div>
              <h5 style="font-family:OpenSans-Regular;">Photos of Incident</h5>
                <div style="margin-bottom: -10px;background-color: #c5c5c5;border-width: 0.5px;border-style: solid; margin-top: -8px;"></div>
              </div>`
              : ``
          }

         
          <div style="display: flex; flex-wrap: wrap; margin-top:20px">
            <!-- Loop through each image URL and create an img tag -->
            ${kitAllDetails?.incident?.incident_pictures
              .map(
                (url) => `
                  <img src="${url}" alt="Image" style="width: 100px; height:120px; margin-left:10px">
                  `
              )
              .join("")}
          </div>


          <div style="margin-top:40">
          <h5 style="font-family:OpenSans-Regular;">Kit and Location Details</h5>
            <div style="margin-bottom: -10px;background-color: #c5c5c5;border-width: 0.5px;border-style: solid; margin-top: -8px;"></div>
          </div>

          <div>
            <h5 style="font-family:OpenSans-Regular; text-align: center;">
           
            ${
              kitAllDetails?.kit
                ? `${
                    kitAllDetails?.kit?.brand !== "false"
                      ? kitAllDetails?.kit?.brand
                      : ""
                  } ${
                    kitAllDetails?.kit?.model_number !== "false"
                      ? kitAllDetails?.kit?.model_number
                      : ""
                  } ${
                    kitAllDetails?.kit?.product_name !== "false"
                      ? kitAllDetails?.kit?.product_name
                      : ""
                  }`
                : `${
                    installKitDetails?.data.kit.brand !== "false"
                      ? installKitDetails?.data.kit.brand
                      : ""
                  } ${
                    installKitDetails?.data.kit.model_number !== "false"
                      ? installKitDetails?.data.kit.model_number
                      : ""
                  } ${installKitDetails?.data.kit.product_name}`
            }
         
            </h5>
          </div>


         
          <div class="top-container">

            <div class="container">
              <p class="heading">Product Code</p>
              <p class="text">
                ${
                  kitAllDetails?.kit
                    ? kitAllDetails?.kit?.product_code == "false"
                      ? null
                      : kitAllDetails?.kit?.product_code
                    : installKitDetails?.data.kit?.product_code == "false"
                    ? null
                    : installKitDetails?.data.kit?.product_code
                }
              </p>
            </div>

            <div class="container">
              <p class="heading">LOT Number</p>
              <p class="text">
                ${
                  kitAllDetails?.kit
                    ? kitAllDetails?.kit?.lot_number == "false"
                      ? null
                      : kitAllDetails?.kit?.lot_number
                    : installKitDetails?.data?.kit.lot_number == "false"
                    ? null
                    : installKitDetails?.data?.kit.lot_number
                }
              </p>
            </div>
      
           
      
            <div class="container">
              <p class="heading">Expiry Date</p>
              <p class="text">
                ${
                  kitAllDetails?.kit
                    ? moment(kitAllDetails?.kit?.expiry_date).format(
                        "DD MMM YYYY"
                      )
                    : formattedDate
                }
              </p>
            </div>
          </div>



        <div class="top-container" style="margin-top:15px">
          <div class="container">
            <p class="heading">Installed Location</p>
            <p class="text">
              ${
                kitAllDetails?.kit
                  ? kitAllDetails?.kit?.location_name
                  : installKitDetails?.data.kit.location_name
              }
            </p>
          </div>
    
          <div class="container" >
            <p class="heading">Installed Area</p>
            <p class="text">
              ${
                kitAllDetails?.kit
                  ? kitAllDetails?.kit?.area
                  : installKitDetails?.data.kit.area
              }
            </p>
          </div>
        </div>


        <div style="margin-top:35">
        <h5 style="font-family:OpenSans-Regular;">Equipments used in Incident</h5>
          <div style="margin-bottom: -10px;background-color: #c5c5c5;border-width: 0.5px;border-style: solid; margin-top: -8px;"></div>
        </div>


        <div>
          <div style="
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            background-color: #047835; /* Assuming Colors.greenTint represents this color */
            padding: 12px 10px;
            margin-top: 20px;
          ">
            <span style="
              color: #fff; /* Assuming Colors.white represents this color */
              font-family: 'Open Sans', sans-serif;
              font-size: 10px;
              font-weight: 700;
              line-height: 15px;
              letter-spacing: -0.011em;
              text-align: left;
            ">
              Used Items
            </span>
            <span style="
            font-family: 'Open Sans', sans-serif;
            font-size: 10px;
            font-weight: 700;
            line-height: 15px;
            letter-spacing: -0.011em;
            text-align: left;
              color: #fff; /* Assuming Colors.white represents this color */
            ">
              Quantity
            </span>
          </div>
           
          <div style="display: flex;
          flex-direction: row;
          justify-content: space-between;
          // background-color: #047835; /* Assuming Colors.greenTint represents this color */
          padding: 12px 10px;
       ">
              <!-- Loop through each image URL and create an img tag -->
              ${
                listData ||
                kitAllDetails?.incident?.item_used
                  .map(
                    (item) => `
                  <span style="
                  // color: #fff; /* Assuming Colors.white represents this color */
                  font-family: 'Open Sans', sans-serif;
                  font-size: 14px;
                  font-weight: 400;
                  line-height: 21px;
                  letter-spacing: -0.011em;
                  text-align: left;
                ">
                  ${item.title + " Used by " + item.full_name}
                </span>
                <span style="
                font-family: 'Open Sans', sans-serif;
                font-size: 14px;
                font-weight: 400;
                line-height: 21px;
                letter-spacing: -0.011em;
                text-align: left;
                  // color: #fff; /* Assuming Colors.white represents this color */
                ">
                ${item.used_quantity}
                </span>
                    `
                  )
                  .join("")
              }
       
          </div>
        </div>


       
        </body>
        </html>
            `, // Pass your HTML content here
        fileName: "converted_document",
        directory: "Documents",
      };
      const pdf = await RNHTMLtoPDF.convert(options);

      // Prepare content to share
      const content = {
        title: "Share PDF",
        url: `file://${pdf.filePath}`, // Provide the file path of the generated PDF
      };

      const result = await Share.share(content);
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
        } else {
          // Shared
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error) {
      console.error("Error sharing:", error.message);
    }
  };

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: Colors.primary }}>
      <Header
        back={() => navigation.navigate(navigationString.profile)}
        backIcon={imagePath.backArrow}
        editHeader={() => {
          key == "incident" || key == "detailReportSummary"
            ? navigation.navigate(navigationString.incident)
            : navigation.goBack();
        }}
      />
      <Modal animated={true} transparent={true} visible={isLoadings}>
        <Loading />
      </Modal>

      <View style={kitsStyles.container}>
        <View
          style={{
            ...kitsStyles.heading,
            marginTop: 15,
            marginHorizontal: 20,
          }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ width: "80%", alignSelf: "center" }}>
              <TextView
                heading
                headingTextSty={{
                  ...kitsStyles.headingText,

                  lineHeight: 21,
                  fontSize: 18,
                }}>
                {AllStrings.SummaryIncidentReport}
              </TextView>
            </View>

            {/* //@Container of Incident Report Made by */}
            <View style={{ marginTop: 15 }}>
              <View>
                <TextView
                  heading
                  headingTextSty={{
                    ...kitsStyles.headingText,
                    textAlign: "left",
                    lineHeight: 21,
                  }}>
                  {AllStrings.IncidentReportmadeby}
                </TextView>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: Colors.blackOpacity10,
                    marginTop: 10,
                  }}
                />
              </View>
              <View style={{ flexDirection: "row" }}>
                <TextView
                  heading
                  headingTextSty={{ fontSize: 14, lineHeight: 21 }}>
                  {AllStrings.Name}:{" "}
                </TextView>
                <TextView textSty={{ fontSize: 14, lineHeight: 21 }}>
                  {/* {kitAllDetails?.reported_by?.first_name +
                    " " +
                    kitAllDetails?.reported_by?.last_name} */}
                  {profileDetails?.data.user_details.first_name +
                    " " +
                    profileDetails?.data.user_details.last_name}
                </TextView>
              </View>

              {kitAllDetails?.reported_by?.contact_number?.length > 6
                ? kitAllDetails?.reported_by?.country_code !== undefined &&
                  kitAllDetails?.reported_by?.country_code !== "" && (
                    <View style={{ flexDirection: "row" }}>
                      <TextView
                        heading
                        headingTextSty={{ fontSize: 14, lineHeight: 21 }}>
                        {AllStrings.ContactNumber}:{" "}
                      </TextView>
                      <TextView textSty={{ fontSize: 14, lineHeight: 21 }}>
                        {kitAllDetails?.reported_by?.country_code +
                          " " +
                          kitAllDetails?.reported_by?.contact_number}
                      </TextView>
                    </View>
                  )
                : null}

              <View style={{ flexDirection: "row" }}>
                <TextView
                  heading
                  headingTextSty={{ fontSize: 14, lineHeight: 21 }}>
                  {AllStrings.Email}:{" "}
                </TextView>
                <TextView textSty={{ fontSize: 14, lineHeight: 21 }}>
                  {profileDetails?.data.user_details.email}
                  {/* {kitAllDetails?.reported_by?.email} */}
                </TextView>
              </View>
            </View>

            {/* //@Container of Type of Incident */}
            <View style={{ marginTop: 20 }}>
              <View>
                <TextView
                  heading
                  headingTextSty={{
                    ...kitsStyles.headingText,
                    textAlign: "left",
                    lineHeight: 21,
                  }}>
                  {AllStrings.TypeIncident}
                </TextView>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: Colors.blackOpacity10,
                    marginTop: 10,
                  }}
                />
              </View>
              {/* <View style={{ flexDirection: "row" }}>
                <TextView
                  heading
                  headingTextSty={{ fontSize: 14, lineHeight: 21 }}>
                  {AllStrings.Category}:{" "}
                </TextView>
                <TextView textSty={{ fontSize: 14, lineHeight: 21 }}>
                  {kitAllDetails?.incident?.category_of_incident ||
                    data?.categoryIncident}
                </TextView>
              </View> */}
              {/* <View style={{ flexDirection: "row" }}>
                <TextView
                  heading
                  headingTextSty={{ fontSize: 14, lineHeight: 21 }}>
                  {AllStrings.Classification}:{" "}
                </TextView>
                <TextView
                  textSty={{
                    fontSize: 14,
                    lineHeight: 21,

                    width: "80%",
                  }}>
                  {data?.classification ||
                    kitAllDetails?.incident?.classification}
                </TextView>
              </View> */}
              <View style={{ flexDirection: "row" }}>
                <TextView
                  heading
                  headingTextSty={{ fontSize: 14, lineHeight: 21 }}>
                  {AllStrings.Date}:{" "}
                </TextView>
                <TextView textSty={{ fontSize: 14, lineHeight: 21 }}>
                  {kitAllDetails?.incident?.incident_date
                    ? moment(kitAllDetails?.incident?.incident_date).format(
                        "DD MMM YYYY"
                      )
                    : moment(data?.date).format("DD MMM YYYY")}
                </TextView>
              </View>
              <View style={{ flexDirection: "row" }}>
                <TextView
                  heading
                  headingTextSty={{ fontSize: 14, lineHeight: 21 }}>
                  {AllStrings.Time}:{" "}
                </TextView>
                <TextView textSty={{ fontSize: 14, lineHeight: 21 }}>
                  {data?.time || kitAllDetails?.incident?.incident_time}
                </TextView>
              </View>
            </View>

            {/* //@Container of Summary of Incident */}

            {kitAllDetails?.incident?.description !== "" &&
              data?.brief !== "" && (
                <View style={{ marginTop: 20 }}>
                  <View>
                    <TextView
                      heading
                      headingTextSty={{
                        ...kitsStyles.headingText,
                        textAlign: "left",
                        lineHeight: 21,
                      }}>
                      {AllStrings.SummaryIncident}
                    </TextView>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: Colors.blackOpacity10,
                        marginTop: 10,
                      }}
                    />
                  </View>

                  <View>
                    <TextView
                      textSty={{
                        fontSize: 14,
                        lineHeight: 21,
                      }}>
                      {data?.brief || kitAllDetails?.incident?.description}
                    </TextView>
                  </View>
                </View>
              )}

            {/* //@Container of Photos of Incident */}
            {kitAllDetails?.incident?.incident_pictures?.length !== 0 &&
              imageUris?.length !== 0 &&
              (key == "detailReportSummary" || key == "detailReport") && (
                <View style={{ marginTop: 20 }}>
                  <View>
                    <TextView
                      heading
                      headingTextSty={{
                        ...kitsStyles.headingText,
                        textAlign: "left",
                        lineHeight: 21,
                      }}>
                      {AllStrings.Photos_of_Incident}
                    </TextView>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: Colors.blackOpacity10,
                        marginTop: 10,
                      }}
                    />
                  </View>
                  <FlatList
                    data={
                      imageUris || kitAllDetails?.incident?.incident_pictures
                    }
                    numColumns={3}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => {
                      console.log("ppppppp", item);
                      return (
                        <View
                          style={{
                            padding: 6,
                          }}>
                          <Image
                            source={{ uri: item.uri || item }}
                            style={{
                              width: responsiveWidth(26),
                              height: responsiveHeight(20),
                            }}
                          />
                          {key == "detailReport" && (
                            <TextView
                              onPressText={() => {
                                removeImage(index);
                              }}
                              textSty={{
                                fontSize: 12,
                                color: Colors.danger,
                                textAlign: "center",
                              }}>
                              Remove
                            </TextView>
                          )}
                        </View>
                      );
                    }}
                  />
                </View>
              )}

            {key == "detailReport" && (
              <View>
                <View
                  style={{
                    backgroundColor: Colors.black,
                    position: "absolute",
                    padding: 6.5,
                    top: 29,
                    zIndex: 999,
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                  }}>
                  <Image
                    source={imagePath.Layer}
                    resizeMode="contain"
                    style={{
                      width: 30,
                      height: 30,
                    }}
                  />
                </View>

                <Button
                  onClick={() => {
                    takePicture();
                  }}
                  allButtonSty={{
                    // backgroundColor: Colors.black,
                    marginVertical: moderateScaleVertical(30),
                    marginHorizontal: 0,
                  }}
                  buttonColor={Colors.black}
                  btnName="Add More Photos"
                />
              </View>
            )}

            {/* //@Container of Kit and Location Details */}
            <View style={{ marginTop: 20 }}>
              <View>
                <TextView
                  heading
                  headingTextSty={{
                    ...kitsStyles.headingText,
                    textAlign: "left",
                    lineHeight: 21,
                  }}>
                  {AllStrings.KitLocationDetails}
                </TextView>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: Colors.blackOpacity10,
                    marginTop: 10,
                  }}
                />
              </View>
            </View>

            <View style={{ width: "80%", alignSelf: "center" }}>
              <TextView
                heading
                headingTextSty={{
                  ...kitsStyles.headingText,
                  lineHeight: 21,
                  marginTop: 20,
                }}>
                {/* {AllStrings.RelianceMedicalMediumWorkplace} */}

                {kitAllDetails?.kit
                  ? `${
                      kitAllDetails?.kit?.brand == "false"
                        ? ""
                        : kitAllDetails?.kit?.brand
                    } ${
                      kitAllDetails?.kit?.model_number == "false"
                        ? ""
                        : kitAllDetails?.kit?.model_number
                    } ${
                      kitAllDetails?.kit?.product_name == "false"
                        ? ""
                        : kitAllDetails?.kit?.product_name
                    }`
                  : `${
                      installKitDetails?.data.kit.brand == "false"
                        ? ""
                        : installKitDetails?.data.kit.brand
                    } ${
                      installKitDetails?.data.kit.model_number == "false"
                        ? ""
                        : installKitDetails?.data.kit.model_number
                    } ${installKitDetails?.data.kit.product_name}`}
              </TextView>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
                gap: 2,
              }}>
              <View style={{ flex: 4 }}>
                <MiniCard
                  heading="Product Code"
                  text={
                    kitAllDetails?.kit
                      ? kitAllDetails?.kit?.product_code == "false"
                        ? null
                        : kitAllDetails?.kit?.product_code
                      : installKitDetails?.data.kit?.product_code == "false"
                      ? null
                      : installKitDetails?.data.kit?.product_code
                  }
                />
              </View>
              <View style={{ flex: 4 }}>
                <MiniCard
                  heading="LOT Number"
                  text={
                    kitAllDetails?.kit
                      ? kitAllDetails?.kit?.lot_number == "false"
                        ? null
                        : kitAllDetails?.kit?.lot_number
                      : installKitDetails?.data?.kit.lot_number == "false"
                      ? null
                      : installKitDetails?.data?.kit.lot_number
                  }
                />
              </View>

              <View style={{ flex: 4 }}>
                <MiniCard
                  heading="Expiry Date"
                  text={
                    kitAllDetails?.kit
                      ? moment(kitAllDetails?.kit?.expiry_date).format(
                          "MMM YYYY"
                        )
                      : formattedDate
                  }
                />
              </View>
            </View>
            {console.log("kitAllDetails?.kit--", kitAllDetails?.kit)}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 12,
              }}>
              <View style={{ width: "49%" }}>
                <MiniCard
                  heading="Installed Location"
                  text={
                    kitAllDetails?.kit
                      ? kitAllDetails?.kit?.location_name
                      : installKitDetails?.data.kit.location_name
                  }
                />
              </View>
              <View style={{ width: "49%" }}>
                <MiniCard
                  heading="Installed Area"
                  text={
                    kitAllDetails?.kit
                      ? kitAllDetails?.kit?.area
                      : installKitDetails?.data.kit.area
                  }
                />
              </View>
            </View>

            {console.log(
              listData,
              "listData || kitAllDetails?.incident?.item_used",
              kitAllDetails?.incident?.item_used
            )}
            {(listData?.length > 0 ||
              kitAllDetails?.incident?.item_used?.length > 0) && (
              <>
                <TextView
                  heading
                  headingTextSty={{
                    ...kitsStyles.headingText,
                    textAlign: "left",
                    lineHeight: 21,
                    marginTop: 30,
                  }}>
                  {AllStrings.EquipmentsIncident}
                </TextView>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: Colors.blackOpacity10,
                    marginTop: 15,
                  }}
                />

                {/* //@Container of Equipments used in Incident */}
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      backgroundColor: Colors.greenTint,
                      paddingHorizontal: 10,
                      paddingVertical: 12,
                      marginTop: 20,
                    }}>
                    <TextView
                      heading
                      headingTextSty={{
                        lineHeight: 15,
                        fontSize: 10,
                        color: Colors.white,
                      }}>
                      {AllStrings.UsedItems}
                    </TextView>
                    <TextView
                      heading
                      headingTextSty={{
                        lineHeight: 15,
                        fontSize: 10,
                        color: Colors.white,
                      }}>
                      {AllStrings.Quantity}
                      {/* {AllStrings.used_quantity} */}
                    </TextView>
                  </View>
                  <View>
                    <FlatList
                      data={listData || kitAllDetails?.incident?.item_used}
                      renderItem={renderItem}
                      keyExtractor={(item) => item.key}
                      style={{
                        height: "auto",
                        marginTop: 1,
                        marginBottom: 0,
                      }}
                    />
                  </View>
                  {key == "detailReport" && (
                    <Button
                      onClick={() => navigation.goBack()}
                      allButtonSty={{
                        backgroundColor: Colors.black,
                        marginBottom: moderateScaleVertical(30),
                        marginHorizontal: 0,
                      }}
                      buttonColor={Colors.white}
                      btnName="Update Items"
                    />
                  )}
                </View>
              </>
            )}

            <View
              style={{
                // justifyContent: "center",
                justifyContent:
                  key == ("incident" || "detailReportSummary")
                    ? "space-evenly"
                    : "space-between",
                alignItems: "center",
                flexDirection: "row",
                marginVertical: 15,
                marginTop: 20,
              }}>
              <Button
                onClick={() => {
                  key == "incident" || key == "detailReportSummary"
                    ? shareContent()
                    : setShowModal(true);
                }}
                allButtonSty={{
                  backgroundColor: Colors.black,
                  borderRadius: 10,
                  marginHorizontal: 0,
                  width:
                    key == "incident" || key == "detailReportSummary"
                      ? "45%"
                      : "35%",
                }}
                buttonColor={Colors.white}
                btnName={
                  key == "incident" || key == "detailReportSummary"
                    ? "Share"
                    : "Cancel"
                }
              />
              <Button
                onClick={() => {
                  key == "incident" || key == "detailReportSummary"
                    ? navigation.navigate(navigationString.incident)
                    : key === "detailReport"
                    ? handleStandardReport()
                    : handleCompleteButton();
                }}
                buttonColor={Colors.black}
                allButtonSty={{
                  alignSelf: "center",
                  marginHorizontal: 0,
                  width:
                    key == "incident" || key == "detailReportSummary"
                      ? "45%"
                      : "60%",

                  borderRadius: 10,
                }}
                btnName={
                  key == "incident" || key == "detailReportSummary"
                    ? "Close"
                    : "Complete"
                }
              />
            </View>

            {showModalSuccess && (
              <ModalScreen
                success
                visible={showModalSuccess}
                modalheading={AllStrings.PleaseConfirm}
                modalText={
                  key === "detailReport" || key === "quickReportInfo2"
                    ? "Incident report was successfully submitted."
                    : AllStrings.Wouldlikecancelreport
                }
                distributorName={
                  (listData?.length > 0 ||
                    kitAllDetails?.incident?.item_used?.length > 0) &&
                  `Please contact ${installKitDetails?.distributor_name} for a quote on used items.`
                }
                btnName1="Continue"
                buttonColor={Colors.white}
                btnStyle={{ backgroundColor: Colors.black }}
                modalButton1={() => {
                  setshowModalSuccess(false);
                  setShowModal(false);
                  navigation.navigate(navigationString.Home);
                }}
                modalButton={
                  () => {
                    setshowModalSuccess(false);
                    setShowModal(false);
                  }
                  // navigation.navigate(navigationString.Approvalcontact)
                }
              />
            )}

            {showModal && (
              <ModalScreen
                visible={showModal}
                modalheading={AllStrings.PleaseConfirm}
                modalText={AllStrings.Wouldlikecancelreport}
                btnName="No"
                btnName1="Yes"
                buttonColor={Colors.white}
                btnStyle={{ backgroundColor: Colors.black }}
                modalButton1={() => {
                  setShowModal(false);
                  navigation.navigate(navigationString.incidentNav);
                }}
                modalButton={
                  () => setShowModal(false)
                  // navigation.navigate(navigationString.Approvalcontact)
                }
              />
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default QuickReportSummary;

const styles = StyleSheet.create({});
