import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/sidebar";
import Drawer from "../components/drawer";
import AddModalMisc from "../components/popups/add-modal-misc";
import EditModalMisc from "../components/popups/edit-modal-misc";
import {
  fetchMiscellaneousExpenses,
  updateMiscellaneousExpense,
  deleteMiscellaneousExpense,
  addMiscellaneousExpense,
} from "../Redux/miscSlice";
import "./misc-page.css";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import ConfirmationDialog from '../components/popups/confirmationDialogue';

const MiscPage = () => {
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
    (state) => state.miscellaneous
  );

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const defaultStartDate = new Date(currentYear - 100, 0, 1); // 100 years before the current year
    const defaultEndDate = new Date(currentYear + 100, 11, 31); // 100 years after the current year
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
    dispatch(
      fetchMiscellaneousExpenses({
        startDate: defaultStartDate,
        endDate: defaultEndDate,
      })
    );  }, [dispatch, refreshKey]);

  const handleEditClick = (expense) => {
    setSelectedExpenseId(expense);
    toggleEditModal();
  };

  const handleEditExpense = (updatedExpense) => {
    dispatch(updateMiscellaneousExpense(updatedExpense));
    setSelectedExpenseId(null);
    refreshTable();
  };

  const handleDeleteClick = (expenseId) => {
    setSelectedExpenseId(expenseId);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    if (selectedExpenseId) {
      dispatch(deleteMiscellaneousExpense(selectedExpenseId));
      setSelectedExpenseId(null);
      refreshTable();
    }
    setShowDeleteConfirmation(false);
    
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleAddExpense = (newExpense) => {
    dispatch(addMiscellaneousExpense(newExpense));
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
    <div className="miscpage">
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
      <main className="misc-panel">
        <header className="mobile-devices5" onClick={toggleDrawer}>
          <div className="container13">
            <img
              className="menu-icon5"
              loading="lazy"
              alt="Menu Icon"
              src="/menu.svg"
            />
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
        <section className="container14">
          <div className="misccard1">
            <div className="label11">
              <img
                className="miscicon1"
                loading="lazy"
                alt=""
                src="/miscicon1@2x.png"
              />
              <h1 className="miscellaneous7">Miscellaneous</h1>
              <button className="total20">
                <div className="total21">Total ₱ </div>
              </button>
            </div>
            <div className="misctotal1">₱ {totalBillAmount}</div>
          </div>

          <div className="container31">
            {" "}
            {/* Removed the <form> element */}
            <div className="heading6">
              <div className="h18">
                <h2 className="expenses15">Expenses/</h2>
                <h2 className="miscellaneous8">Miscellaneous</h2>
              </div>
              <button className="addexbtn5" onClick={toggleAddModal}>
                <img className="edit-button-icon" alt="" src="/vector-10.svg" />
                <div className="add-expense5">Add Expense</div>
              </button>
            </div>
            <div className="table5">
              <div className="row10">
                <div className="header-cell20">
                  <div className="service-provider5">Description</div>
                </div>
                <div className="header-cell21">
                  <div className="date-paid5">Date Paid</div>
                </div>
                <div className="header-cell22">
                  <div className="amount3">Amount</div>
                </div>
                <div className="header-cell23">
                  <div className="action5">Action</div>
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
                  <div className="row11" key={expense.expenseId}>
                    <div className="table-cell20">{expense.billMonth}</div>
                    <div className="table-cell21">
                    {expense.datePaid}                    </div>
                    <div className="table-cell22">₱ {expense.billAmount}</div>
                    <div className="table-cell23">
                      <div className="buttons5">
                        <button
                          className="edit-button5"
                          onClick={() => handleEditClick(expense)}
                        >
                          <div className="edit5">Edit</div>
                        </button>

                        <button
                          className="delete-button5"
                          onClick={() => handleDeleteClick(expense.expensesId)}
                        >
                          <div className="delete6">Delete</div>
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

        {showAddModal && (
          <div className="modal-backdrop">
            <AddModalMisc
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
            <EditModalMisc
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
      </main>
    </div>
  );
};

export default MiscPage;
