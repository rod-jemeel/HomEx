import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/sidebar";
import Drawer from "../components/drawer";
import AddModalElec from "../components/popups/add-modal-elec";
import EditModalElec from "../components/popups/edit-modal-elec";
import {
  fetchElectricityExpenses,
  updateElectricityExpense,
  deleteElectricityExpense,
  addElectricityExpense
} from "../Redux/electricitySlice";
import "./electricity-page.css";

const ElectricityPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const dispatch = useDispatch();
  const { expenses, totalBillAmount, loading, error } = useSelector(
    (state) => state.electricity
  );

  useEffect(() => {
    dispatch(fetchElectricityExpenses());
  }, [dispatch, refreshKey]);

  const handleEditClick = (expense) => {
    console.log(expense)
    setSelectedExpenseId(expense);
    toggleEditModal();
  };

  const handleEditExpense = (updatedExpense) => {
    dispatch(updateElectricityExpense(updatedExpense));
    setSelectedExpenseId(null);
    refreshTable();
  };

  const handleDeleteClick = (expenseId) => {
    setSelectedExpenseId(expenseId);
    setShowDeleteConfirmation(true); // Show confirmation modal on first click
  };
  
  const handleConfirmDelete = () => {
    if (selectedExpenseId) {
      dispatch(deleteElectricityExpense(selectedExpenseId));
      setSelectedExpenseId(null);
      refreshTable();
    }
    setShowDeleteConfirmation(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleAddExpense = (newExpense) => {
    dispatch(addElectricityExpense(newExpense));
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsDrawerOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  return (
    <div className="electricitypage1">
      <Sidebar />
      {isDrawerOpen && <Drawer />}
      <main className="electricity-panel1">
        <header className="mobile-devices6" onClick={toggleDrawer}>
          <div className="container15">
            <img
              className="menu-icon6"
              loading="lazy"
              alt="Menu Icon"
              src="/menu.svg"
            />
          </div>
        </header>
        {showDeleteConfirmation && (
        <div className="delete-confirmation-modal">
          <p>Are you sure you want to delete this expense?</p>
          <button onClick={handleConfirmDelete}>Yes</button>
          <button onClick={handleCancelDelete}>No</button>
        </div>
      )}
        <section className="container16">
          <div className="electricitycard2">
            <div className="label10">
              <img
                className="electricityicon2"
                loading="lazy"
                alt=""
                src="/electricityicon2@2x.png"
              />
              <h1 className="electricity3">Electricity</h1>
              <div className="total18">
                <div className="total19">Total $</div>
              </div>
            </div>
            <div className="electricitytotal2">${totalBillAmount}</div>
          </div>

          <div className="container17">
            <div className="heading4">
              <div className="h17">
                <h2 className="expenses4">Expenses/</h2>
                <h2 className="electricity4">Electricity</h2>
              </div>
              <button className="addexbtn4" onClick={toggleAddModal}>
                <img className="vector-icon3" alt="" src="/vector-10.svg" />
                <div className="add-expense4">Add Expense</div>
              </button>
            </div>

            <div className="table4">
              <div className="row8">
                <div className="header-cell16">
                  <div className="service-provider4">Service Provider</div>
                </div>
                <div className="header-cell17">
                  <div className="date-paid4">Date Paid</div>
                </div>
                <div className="header-cell18">
                  <div className="amount2">Amount</div>
                </div>
                <div className="header-cell19">
                  <div className="action4">Action</div>
                </div>
              </div>
              {/* Conditional Rendering for Table Data */}
              {loading ? (
                <div className="loading-indicator">Loading expenses...</div>
              ) : error ? (
                <div className="error-message">Error: {error.message}</div>
              ) : (
                // Table Rows (dynamically generated)
                expenses.map((expense) => (
                  <div className="row9" key={expense.expenseId}>
                    <div className="table-cell16">{expense.billMonth}</div>
                    <div className="table-cell17">{expense.datePaid}</div>
                    <div className="table-cell18">${expense.billAmount}</div>
                    <div className="table-cell19">
                      <button
                        className="edit-button4"
                        onClick={(e) => handleEditClick(expense) }
                      >
                        Edit
                      </button>
                      
                      <button
                        className="delete-button4"
                        onClick={() => handleDeleteClick(expense.expenseId)}
                        >
                        Delete
                      </button>
                    </div>
                    <div style={{display: 'none'}}>{expense.expenseId}</div>
                  </div>
                ))
              )}
              
            </div>
          </div>
        </section>
      </main>

      {showAddModal && (
        <div className="modal-backdrop">
          <AddModalElec
            close={() => {
              toggleAddModal();
              refreshTable();
            }}
            onAddExpense={handleAddExpense}
          />
        </div>
      )}
      {showEditModal && (
        <div className="modal-backdrop">
          <EditModalElec 
            close={() => {
              toggleEditModal();
              refreshTable();
            }}
            expense={selectedExpenseId}
            onSave={handleEditExpense} 
          />
        </div>
      )}
    </div>
  );
};

export default ElectricityPage;
