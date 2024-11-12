import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiEndPoint, StatusCode } from "../../services/helper";
import API from "../../services/api";
import { toast } from "react-toastify";
const initialState = {
  MessageCentreData: {},
  status: StatusCode.IDLE,
};
const {
  MESSAGECENTRE,
  ARTICLEREGISTRATION,
  NOTIFICATIONREGISTRATION,
  MESSAGECENTREDATAID,
  UPDATEARTICAL,
  UPDATENOTIFICATION,
  DELETEMESSAGECENTERDATA,
} = ApiEndPoint;

export const messageCentreSlice = createSlice({
  name: "MessageCentre",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessageCentreData.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(fetchMessageCentreData.fulfilled, (state, action) => {
        state.MessageCentreData = action.payload.data;
        state.status = StatusCode.IDLE;
      })
      .addCase(fetchMessageCentreData.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      })
      .addCase(RegisterEditArticle.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(RegisterEditArticle.fulfilled, (state, action) => {
        state.MessageCentreData = action.payload;
        state.status = StatusCode.IDLE;
      })
      .addCase(RegisterEditArticle.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      })
      // notification
      .addCase(RegisterEditNotification.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(RegisterEditNotification.fulfilled, (state, action) => {
        state.MessageCentreData = action.payload;
        state.status = StatusCode.IDLE;
      })
      .addCase(RegisterEditNotification.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      })

      // delete articles and notification
      .addCase(deleteMessageCenterData.pending, (state, action) => {
        state.status = StatusCode.LOADING;
      })
      // .addCase(deleteKitManagementData.fulfilled, (state, action) => {
      //   if (Array.isArray(state.KitManagementData)) {
      //     state.KitManagementData = state.KitManagementData.filter(
      //       (curElm) => !action.payload?.kitIds.includes(curElm._id)
      //     );
      //   }
      //   state.status = StatusCode.IDLE;
      // })
      .addCase(deleteMessageCenterData.fulfilled, (state, action) => {
        const deleteMessageIds = action.payload.deleteMessageIds || [];

        if (Array.isArray(deleteMessageIds) && deleteMessageIds.length > 0) {
          // Filter out elements based on both article_id and type
          state.MessageCentreData = state.MessageCentreData.filter((curElm) => {
            return !deleteMessageIds.some(
              ({ type, article_id, notification_id }) => {
                if (type === "Article") {
                  return curElm.article_id === article_id;
                } else if (type === "Notification") {
                  return curElm.notification_id === notification_id;
                }
                return false;
              }
            );
          });
        }

        state.status = StatusCode.IDLE;
      })

      .addCase(deleteMessageCenterData.rejected, (state, action) => {
        state.status = StatusCode.ERROR;
      });
  },
});

export const {} = messageCentreSlice.actions;
export default messageCentreSlice.reducer;

export const fetchMessageCentreData = createAsyncThunk(
  "admin/get/message-centre",
  async () => {
    try {
      const res = await API.get(MESSAGECENTRE);
      if (res.data?.status === 200) {
        return res.data;
      }
    } catch (error) {
      console.error("Failed to fetch message centre  data:", error);
      throw error;
    }
  }
);

export const getMessageDetails = createAsyncThunk(
  "/user/get-message-detail",
  async (data) => {
    try {
      const res = await API.get(
        `${MESSAGECENTREDATAID}?id=${data.id}&type=${data.type}`
      );
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }
);

export const RegisterEditArticle = createAsyncThunk(
  "/user/edit-article",
  async (data) => {
    try {
      const res = await API.post(`${ARTICLEREGISTRATION}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data?.status === 200) {
        toast.success(res.data?.data?.message);
      }
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }
);

export const updateMsgArticle = createAsyncThunk(
  "/user/update-message-article",
  async (data) => {
    try {
      const res = await API.put(`${UPDATEARTICAL}`, data);
      if (res.data?.status === 200) {
        toast.success(res.data?.data?.message);
      }
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }
);

export const updateMsgNotification = createAsyncThunk(
  "/user/update-message-notification",
  async (data) => {
    try {
      const res = await API.put(`${UPDATENOTIFICATION}`, data);
      if (res.data?.status === 200) {
        toast.success(res.data?.data?.message);
      }
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }
);

export const RegisterEditNotification = createAsyncThunk(
  "/user/edit-notification",
  async (data) => {
    try {
      const res = await API.post(`${NOTIFICATIONREGISTRATION}`, data);
      if (res.data?.status === 200) {
        toast.success(res.data?.data?.message);
      }
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }
);

export const deleteMessageCenterData = createAsyncThunk(
  "admin/delete/message-center",
  async (data) => {
    console.log(data, "data");
    try {
      const res = await API.delete(`${DELETEMESSAGECENTERDATA}`, {
        data: data,
      });
      if (res.status === 200) {
        toast.success(res?.data?.message);
        return data;
      }
    } catch (error) {
      toast.error(error.data?.message);
      throw error;
    }
  }
);
