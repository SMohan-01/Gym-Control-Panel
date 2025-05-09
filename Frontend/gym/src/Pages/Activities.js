import React, { useContext, useState } from "react";
import "../styles/Activities.css";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import MemberTable from "../components/MemberTable";

const Activities = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { BACKENDURL } = useContext(AppContext);
  const [showMembers, setShowMembers] = useState(false);
  const [members, setMembers] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [showExpiringOnly, setShowExpiringOnly] = useState(false);
  const [isRenew, setIsRenew] = useState(false);
  const [showExpiredOnly, setShowExpiredOnly] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    membershipType: "",
    membershipStartDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${BACKENDURL}/members/fetchAllMembers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
      setMembers(res.data);
      setShowMembers(true);
      setShowExpiringOnly(false);
      setShowExpiredOnly(false);
    } catch {
      toast.error("Failed to load members.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BACKENDURL}/members/deleteMember/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
      toast.success("Member deleted successfully");
      fetchMembers();
    } catch {
      toast.error("Failed to delete member");
    }
  };

  const handleEdit = (member) => {
    setIsEdit(true);
    setShowRegisterModal(true);
    setFormData({ ...member });
  };

  const getFilteredMembers = () => {
    if (showExpiredOnly) return members;
    if (!showExpiringOnly) return members;
    const today = new Date();
    const limit = new Date();
    limit.setDate(today.getDate() + 30);

    return members.filter((m) => {
      const endDate = new Date(m.membershipEndDate);
      return endDate >= today && endDate <= limit;
    });
  };

  const handleRenew = (member) => {
    setIsRenew(true);
    setIsEdit(true);
    setShowRegisterModal(true);
    setFormData({
      ...member,
      membershipType: "",
      membershipStartDate: "",
      membershipEndDate: "",
    });
  };

  const fetchExpiredMembers = async () => {
    try {
      const res = await axios.get(`${BACKENDURL}/members/expired`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
      setMembers(res.data);
      setShowMembers(true);
      setShowExpiredOnly(true);
      setShowExpiringOnly(false);
    } catch {
      toast.error("Failed to load expired members.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      membershipStartDate: formData.membershipStartDate,
      membershipEndDate: formData.membershipEndDate,
      membershipType: formData.membershipType,
    };

    try {
      if (isRenew) {
        await axios.put(
          `${BACKENDURL}/members/renewMembership/${formData.id}`,
          formData.membershipType,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("Token")}`,
              "Content-Type": "text/plain",
            },
          }
        );
        toast.success("Membership renewed successfully");
      } else if (isEdit) {
        await axios.put(
          `${BACKENDURL}/members/updateMembers/${formData.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("Token")}`,
            },
          }
        );
        toast.success("Member updated successfully");
      } else {
        await axios.post(`${BACKENDURL}/members/register`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        });
        toast.success("Member registered successfully");
      }

      fetchMembers();
      setShowRegisterModal(false);
      setIsEdit(false);
      setIsRenew(false);
      setFormData({
        fullName: "",
        emailAddress: "",
        phoneNumber: "",
        gender: "",
        dateOfBirth: "",
        address: "",
        membershipType: "",
        membershipStartDate: "",
      });
    } catch (error) {
      toast.error(error.response?.data || "Something went wrong!");
      console.log(payload.membershipType);
    }
  };

  return (
    <div className="activities-container">
      <div className="activities-header">
        <div className="button-group">
          <button
            className="action-button"
            onClick={() => {
              setShowRegisterModal(true);
              setIsEdit(false);
            }}
          >
            Register Member
          </button>
          <button className="action-button" onClick={fetchMembers}>
            Show Members
          </button>
          <button
            className="action-button"
            onClick={() => {
              setShowExpiringOnly(true);
              setShowExpiredOnly(false);
            }}
          >
            Show Members Whose Plans Expiring
          </button>
          <button className="action-button" onClick={fetchExpiredMembers}>
            Show Membership Expired Members
          </button>
        </div>
      </div>

      {showRegisterModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>
              {isRenew
                ? "Renew Membership"
                : isEdit
                ? "Edit Member"
                : "Register Member"}
            </h2>
            <form onSubmit={handleSubmit} className="form-overall">
              <div className="form">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Name"
                  className="control"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="emailAddress"
                  placeholder="Email"
                  className="control"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form">
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Phone"
                  className="control"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
                <select
                  name="gender"
                  className="control"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="form">
                <input
                  type="date"
                  name="dateOfBirth"
                  placeholder="DOB"
                  className="control"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  className="control"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              {(!isEdit || isRenew) && (
                <div className="form">
                  <select
                    name="membershipType"
                    className="control"
                    value={formData.membershipType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Plan</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="halfyearly">Half-Yearly</option>
                    <option value="annual">Annual</option>
                  </select>
                </div>
              )}
              <div className="modal-buttons">
                <button type="submit" className="submit-btn">
                  Submit
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowRegisterModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showExpiringOnly && (
        <p>Showing members whose plans expire within 30 days.</p>
      )}

      {showExpiredOnly && (
        <p>Showing members whose memberships have already expired.</p>
      )}

      {showMembers && (
        <MemberTable
          data={getFilteredMembers()}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRenew={handleRenew}
          showRenewButton={showExpiringOnly || showExpiredOnly}
        />
      )}
    </div>
  );
};
export default Activities;
