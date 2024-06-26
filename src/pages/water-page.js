import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/sidebar";
import Drawer from "../components/drawer";
import AddModalWater from "../components/popups/add-modal-water";
import EditModalWater from "../components/popups/edit-modal-water";
import {
  fetchWaterExpenses,
  updateWaterExpense,
  deleteWaterExpense,
  addWaterExpense,
} from "../Redux/waterSlice";
import "./water-page.css";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import ConfirmationDialog from "../components/popups/confirmationDialogue";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
const WaterPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [open, setOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  useEffect(() => {
    if (successMessage && !hasShown) {
      setOpen(true);
      setHasShown(true);
    }
  }, [successMessage, hasShown]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const dispatch = useDispatch();
  const { expenses, totalBillAmount, loading, error } = useSelector(
    (state) => state.water
  );

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const defaultStartDate = new Date(currentYear - 100, 0, 1); // 100 years before the current year
    const defaultEndDate = new Date(currentYear + 100, 11, 31); // 100 years after the current year
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
    dispatch(
      fetchWaterExpenses({
        startDate: defaultStartDate,
        endDate: defaultEndDate,
      })
    );
  }, [dispatch, refreshKey]);

  const handleEditClick = (expense) => {
    setSelectedExpenseId(expense);
    toggleEditModal();
  };

  const handleEditExpense = (updatedExpense) => {
    dispatch(updateWaterExpense(updatedExpense));
    setSelectedExpenseId(null);
    refreshTable();
  };

  const handleDeleteClick = (expenseId) => {
    setSelectedExpenseId(expenseId);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    if (selectedExpenseId) {
      dispatch(deleteWaterExpense(selectedExpenseId));
      setSelectedExpenseId(null);
      refreshTable();
    }
    setShowDeleteConfirmation(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleAddExpense = (newExpense) => {
    dispatch(addWaterExpense(newExpense));
    refreshTable();
  };

  const refreshTable = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);
  };

  const toggleEditModal = () => {
    setShowEditModal(!showEditModal);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div className="waterpage">
      {windowWidth > 768 ? <Sidebar /> : isDrawerOpen && <Drawer />}
      {successMessage && (
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <MuiAlert
            onClose={handleClose}
            severity="success"
            elevation={6}
            variant="filled"
          >
            {successMessage}
          </MuiAlert>
        </Snackbar>
      )}
      <main className="water-panel">
        <header className="mobile-devices" onClick={toggleDrawer}>
          <div className="container">
            <img className="menu-icon" loading="lazy" alt="" src="/menu.svg" />
          </div>
        </header>

        {showDeleteConfirmation && (
          <ConfirmationDialog
            mode="delete"
            title="Delete Confirmation"
            open={showDeleteConfirmation}
            handleCancel={handleCancelDelete}
            handleConfirm={handleConfirmDelete}
          />
        )}

        <section className="container1">
          <div className="watercard">
            <div className="label">
              <img
                className="watericon"
                loading="lazy"
                alt=""
                src="/watericon@2x.png"
              />
              <h1 className="water">Water</h1>
              <div className="total">
                <div className="total1">Total ₱ </div>
              </div>
            </div>
            <div className="watertotal">₱ {totalBillAmount}</div>
          </div>

          <div className="container2">
            <div className="heading">
              <div className="h17">
                <h2 className="expenses">Expenses/</h2>
                <h2 className="water1">Water</h2>
              </div>
              <button className="addexbtn" onClick={toggleAddModal}>
                <img
                  className="editing-cell-icon"
                  alt=""
                  src="/vector-10.svg"
                />
                <div className="add-expense">Add Expense</div>
              </button>
            </div>

            <div className="table">
              <div className="row">
                <div className="header-cell">
                  <div className="service-provider">Billing Month</div>
                </div>
                <div className="header-cell1">
                  <div className="date-paid">Date Paid</div>
                </div>
                <div className="header-cell2">
                  <div className="amount">Amount</div>
                </div>
                <div className="header-cell3">
                  <div className="action">Action</div>
                </div>
              </div>

              {/* Conditional Rendering for Table Data */}
              {loading ? (
                <Box sx={{ width: "100%" }}>
                  <LinearProgress />
                </Box>
              ) : error ? (
                <div className="error-message">Error: {error.message}</div>
              ) : (
                // Table Rows (dynamically generated)
                expenses.map((expense) => (
                  <div className="row1" key={expense.expenseId}>
                    <div className="table-cell">{expense.billMonth}</div>
                    <div className="table-cell1">{expense.datePaid} </div>
                    <div className="table-cell2">₱ {expense.billAmount}</div>
                    <div className="table-cell3">
                      <div className="buttons">
                        <button
                          className="edit-button"
                          onClick={() => handleEditClick(expense)}
                        >
                          <div className="edit">Edit</div>
                        </button>

                        <button
                          className="delete-button"
                          onClick={() => handleDeleteClick(expense.expensesId)}
                        >
                          <div className="delete">Delete</div>
                        </button>
                      </div>
                    </div>
                    <div style={{ display: "none" }}>{expense.expenseId}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      {showAddModal && (
        <div className="modal-backdrop">
          <AddModalWater
            close={() => {
              toggleAddModal();
              refreshTable();
            }}
            onAddExpense={handleAddExpense}
            onSuccess={setSuccessMessage}
          />
        </div>
      )}
      {showEditModal && (
        <div className="modal-backdrop">
          <EditModalWater
            close={() => {
              toggleEditModal();
              refreshTable();
            }}
            expense={selectedExpenseId}
            onSave={handleEditExpense}
            onSuccess={setSuccessMessage}
          />
        </div>
      )}
    </div>
  );
};

export default WaterPage;
