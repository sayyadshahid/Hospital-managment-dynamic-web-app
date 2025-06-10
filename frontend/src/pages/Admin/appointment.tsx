// src/components/AppointmentTable.tsx

import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Checkbox } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import API from "../../components/configs/API";

interface User {
  appointment_id: string;
  name: string;
  email: string;
  degree: string;
  docId: string;
  is_success: boolean;
}

const AppointmentTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch appointments from backend
  const fetchUsers = async () => {
    try {
      const res = await API.get("get-all-appointments");
      setUsers(res.data.appointments);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSuccessToggle = async (user: User) => {
    try {
      const updatedUser = { ...user, is_success: !user.is_success };

      await API.put(`update-appointment/${user.appointment_id}`, {
        is_success: updatedUser.is_success,
      });

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.appointment_id === user.appointment_id ? updatedUser : u
        )
      );
    } catch (error) {
      console.error("Failed to update is_success:", error);
    }
  };

  const appointmentIdColumn: GridColDef = {
    field: "appointment_id",
    headerName: "ID",
    width: 200,
  };

  const nameColumn: GridColDef = {
    field: "name",
    headerName: "Name",
    width: 180,
  };

  const emailColumn: GridColDef = {
    field: "email",
    headerName: "Email",
    width: 200,
  };

  const doctorIdColumn: GridColDef = {
    field: "docId",
    headerName: "Doctor Id",
    width: 200,
  };

  const isSuccessColumn: GridColDef = {
    field: "is_success",
    headerName: "Success",
    width: 120,
    renderCell: (params) => (
      <Checkbox
        checked={params.value}
        onChange={() => handleSuccessToggle(params.row)}
      />
    ),
  };

  const columns: GridColDef[] = [
    appointmentIdColumn,
    nameColumn,
    emailColumn,
    doctorIdColumn,
    isSuccessColumn,
  ];

  return (
    <Box height={600} width="100%">
      {loading ? (
        <CircularProgress />
      ) : (
        <DataGrid
          rows={users}
          columns={columns}
          getRowId={(row) => row.appointment_id}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5, page: 0 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />
      )}
    </Box>
  );
};

export default AppointmentTable;
