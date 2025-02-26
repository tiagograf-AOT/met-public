import React, { createContext, useState, useEffect } from 'react';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { createDefaultPageInfo, PageInfo, PaginationOptions } from 'components/common/Table/types';
import { User } from 'models/user';
import { getUserList } from 'services/userService/api';

export interface UserManagementContextProps {
    usersLoading: boolean;
    pageInfo: PageInfo;
    users: User[];
    paginationOptions: PaginationOptions<User>;
    setPaginationOptions: React.Dispatch<React.SetStateAction<PaginationOptions<User>>>;
    addUserModalOpen: boolean;
    setAddUserModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    loadUserListing: () => void;
}

export type EngagementParams = {
    engagementId: string;
};

export const UserManagementContext = createContext<UserManagementContextProps>({
    usersLoading: true,
    pageInfo: createDefaultPageInfo(),
    users: [],
    paginationOptions: {
        page: 0,
        size: 0,
    },
    setPaginationOptions: () => {
        throw new Error('Not implemented');
    },
    addUserModalOpen: false,
    setAddUserModalOpen: () => {
        throw new Error('Not implemented');
    },
    loadUserListing: () => {
        throw new Error('Load user listing is not implemented');
    },
});

export const UserManagementContextProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const dispatch = useAppDispatch();
    const [users, setUsers] = useState<User[]>([]);
    const [pageInfo, setPageInfo] = useState<PageInfo>(createDefaultPageInfo());
    const [usersLoading, setUsersLoading] = useState(true);
    const [addUserModalOpen, setAddUserModalOpen] = useState(false);

    const [paginationOptions, setPaginationOptions] = useState<PaginationOptions<User>>({
        page: 1,
        size: 10,
        sort_key: 'first_name',
        nested_sort_key: 'first_name',
        sort_order: 'asc',
    });

    useEffect(() => {
        loadUserListing();
    }, [paginationOptions]);

    const { page, size, sort_key, nested_sort_key, sort_order } = paginationOptions;

    const loadUserListing = async () => {
        try {
            setUsersLoading(true);
            const response = await getUserList({
                page,
                size,
                sort_key: nested_sort_key || sort_key,
                sort_order,
                include_groups: true,
            });
            setUsers(response.items);
            setPageInfo({
                total: response.total,
            });
            setUsersLoading(false);
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while trying to fetch users, please refresh the page or try again at a later time',
                }),
            );
            setUsersLoading(false);
        }
    };

    return (
        <UserManagementContext.Provider
            value={{
                users,
                pageInfo,
                usersLoading,
                paginationOptions,
                setPaginationOptions,
                addUserModalOpen,
                setAddUserModalOpen,
                loadUserListing,
            }}
        >
            {children}
        </UserManagementContext.Provider>
    );
};
