import React, { useContext } from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import SearchIcon from '@mui/icons-material/Search';
import { User } from 'models/user';
import { HeadCell, PaginationOptions } from 'components/common/Table/types';
import { MetPageGridContainer, PrimaryButton } from 'components/common';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import MetTable from 'components/common/Table';
import { formatDate } from 'components/common/dateHelper';
import { UserManagementContext } from './UserManagementContext';

const UserManagementListing = () => {
    const { pageInfo, paginationOptions, setPaginationOptions, users, usersLoading, setAddUserModalOpen } =
        useContext(UserManagementContext);

    const headCells: HeadCell<User>[] = [
        {
            key: 'first_name',
            numeric: false,
            disablePadding: true,
            label: 'User Name',
            allowSort: true,
            renderCell: (row: User) => (
                <MuiLink to={`/usermanagement/${row.id}/details`} component={Link}>
                    {row.last_name + ', ' + row.first_name}
                </MuiLink>
            ),
        },
        {
            key: 'main_role',
            numeric: false,
            disablePadding: true,
            label: 'Role',
            allowSort: true,
            renderCell: (row: User) => {
                return row.main_role;
            },
        },
        {
            key: 'created_date',
            numeric: false,
            disablePadding: true,
            label: 'Date Added',
            allowSort: true,
            renderCell: (row: User) => formatDate(row.created_date),
        },
        {
            key: 'status',
            numeric: false,
            disablePadding: true,
            label: 'Status',
            allowSort: true,
            /* TODO Hardcoded value since currently we have all users as active. 
            Need to change once we have different user status */
            renderCell: () => 'Active',
        },
    ];

    return (
        <MetPageGridContainer
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            container
            columnSpacing={2}
            rowSpacing={1}
        >
            <Grid item xs={12} lg={10}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} width="100%" justifyContent="space-between">
                    <Stack direction="row" spacing={1} alignItems="center">
                        <TextField
                            id="user-name"
                            variant="outlined"
                            label="Search Users by name"
                            fullWidth
                            name="searchText"
                            size="small"
                        />
                        <PrimaryButton>
                            <SearchIcon />
                        </PrimaryButton>
                    </Stack>
                    <PrimaryButton onClick={() => setAddUserModalOpen(true)}>+ Add User</PrimaryButton>
                </Stack>
            </Grid>
            <Grid item xs={12} lg={10}>
                <MetTable
                    headCells={headCells}
                    rows={users}
                    handleChangePagination={(paginationOptions: PaginationOptions<User>) =>
                        setPaginationOptions(paginationOptions)
                    }
                    paginationOptions={paginationOptions}
                    loading={usersLoading}
                    pageInfo={pageInfo}
                />
            </Grid>
        </MetPageGridContainer>
    );
};

export default UserManagementListing;
