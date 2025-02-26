import React, { createContext, useState, useEffect } from 'react';
import { postEngagement, getEngagement, patchEngagement } from '../../../services/engagementService';
import {
    postEngagementMetadata,
    getEngagementMetadata,
    patchEngagementMetadata,
} from '../../../services/engagementMetadataService';
import { useNavigate, useParams } from 'react-router-dom';
import { EngagementContext, EngagementForm, EngagementFormUpdate, EngagementParams } from './types';
import {
    createDefaultEngagement,
    createDefaultEngagementMetadata,
    Engagement,
    EngagementMetadata,
} from '../../../models/engagement';
import { saveDocument } from 'services/objectStorageService';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppDispatch, useAppSelector } from 'hooks';
import { getErrorMessage } from 'utils';
import { updatedDiff, diff } from 'deep-object-diff';
import { PatchEngagementRequest } from 'services/engagementService/types';
import { SCOPES } from 'components/permissionsGate/PermissionMaps';

export const ActionContext = createContext<EngagementContext>({
    handleCreateEngagementRequest: (_engagement: EngagementForm): Promise<Engagement> => {
        return Promise.reject();
    },
    handleUpdateEngagementRequest: (_engagement: EngagementFormUpdate): Promise<Engagement> => {
        return Promise.reject();
    },
    handleCreateEngagementMetadataRequest: (_engagement: EngagementMetadata): Promise<EngagementMetadata> => {
        return Promise.reject();
    },
    handleUpdateEngagementMetadataRequest: (_engagement: EngagementMetadata): Promise<EngagementMetadata> => {
        return Promise.reject();
    },
    isSaving: false,
    savedEngagement: createDefaultEngagement(),
    engagementMetadata: createDefaultEngagementMetadata(),
    engagementId: 'create',
    loadingSavedEngagement: true,
    handleAddBannerImage: (_files: File[]) => {
        /* empty default method  */
    },
    fetchEngagement: () => {
        /* empty default method  */
    },
    fetchEngagementMetadata: () => {
        /* empty default method  */
    },
});

export const ActionProvider = ({ children }: { children: JSX.Element }) => {
    const { engagementId } = useParams<EngagementParams>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { roles, assignedEngagements } = useAppSelector((state) => state.user);

    const [isSaving, setSaving] = useState(false);
    const [loadingSavedEngagement, setLoadingSavedEngagement] = useState(true);

    const [savedEngagement, setSavedEngagement] = useState<Engagement>(createDefaultEngagement());
    const [engagementMetadata, setEngagementMetadata] = useState<EngagementMetadata>(createDefaultEngagementMetadata());

    const [bannerImage, setBannerImage] = useState<File | null>();
    const [savedBannerImageFileName, setSavedBannerImageFileName] = useState('');

    const handleAddBannerImage = (files: File[]) => {
        if (files.length > 0) {
            setBannerImage(files[0]);
            return;
        }

        setBannerImage(null);
        setSavedBannerImageFileName('');
    };

    const fetchEngagement = async () => {
        if (engagementId !== 'create' && isNaN(Number(engagementId))) {
            navigate('/');
        }

        if (engagementId === 'create') {
            setLoadingSavedEngagement(false);
            return;
        }

        try {
            const engagement = await getEngagement(Number(engagementId));
            setEngagement(engagement);
        } catch (err) {
            console.log(err);
            dispatch(openNotification({ severity: 'error', text: 'Error Fetching Engagement' }));
        }
    };

    const fetchEngagementMetadata = async () => {
        if (engagementId === 'create') {
            return;
        }

        try {
            const engagement = await getEngagementMetadata(Number(engagementId));
            setEngagementMetadata(engagement);
        } catch (err) {
            console.log(err);
            dispatch(openNotification({ severity: 'error', text: 'Error Fetching Engagement Metadata' }));
        }
    };
    const setEngagement = (engagement: Engagement) => {
        setSavedEngagement({ ...engagement });
        setSavedBannerImageFileName(engagement.banner_filename);
        setLoadingSavedEngagement(false);
        if (bannerImage) setBannerImage(null);
    };

    const verifyUserAuthorization = () => {
        if (roles.includes(SCOPES.viewPrivateEngagements)) {
            return;
        }

        if (!assignedEngagements.includes(Number(engagementId))) {
            navigate('/unauthorized');
        }
    };

    useEffect(() => {
        verifyUserAuthorization();
        fetchEngagement();
        fetchEngagementMetadata();
    }, [engagementId]);

    const handleCreateEngagementMetadataRequest = async (
        engagement: EngagementMetadata,
    ): Promise<EngagementMetadata> => {
        setSaving(true);
        try {
            const result = await postEngagementMetadata(engagement);
            dispatch(openNotification({ severity: 'success', text: 'Engagement Metadata Created Successfully' }));
            setSaving(false);
            return Promise.resolve(result);
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: getErrorMessage(error) || 'Error Creating Engagement Metadata',
                }),
            );
            setSaving(false);
            console.log(error);
            return Promise.reject(error);
        }
    };

    const handleCreateEngagementRequest = async (engagement: EngagementForm): Promise<Engagement> => {
        setSaving(true);
        try {
            const uploadedBannerImageFileName = await handleUploadBannerImage();
            const result = await postEngagement({
                ...engagement,
                banner_filename: uploadedBannerImageFileName,
            });

            dispatch(openNotification({ severity: 'success', text: 'Engagement Created Successfully' }));
            setSaving(false);
            return Promise.resolve(result);
        } catch (error) {
            dispatch(
                openNotification({ severity: 'error', text: getErrorMessage(error) || 'Error Creating Engagement' }),
            );
            setSaving(false);
            console.log(error);
            return Promise.reject(error);
        }
    };

    const handleUploadBannerImage = async () => {
        if (!bannerImage) {
            return savedBannerImageFileName;
        }
        try {
            const savedDocumentDetails = await saveDocument(bannerImage, { filename: bannerImage.name });
            return savedDocumentDetails?.uniquefilename || '';
        } catch (error) {
            console.log(error);
            throw new Error('Error occurred during banner image upload');
        }
    };

    const handleUpdateEngagementRequest = async (engagement: EngagementFormUpdate): Promise<Engagement> => {
        setSaving(true);
        try {
            const uploadedBannerImageFileName = await handleUploadBannerImage();
            const state = { ...savedEngagement, status_block: undefined };
            const engagementEditsToPatch = updatedDiff(state, {
                ...engagement,
                banner_filename: uploadedBannerImageFileName,
            }) as PatchEngagementRequest;
            const updatedEngagement = await patchEngagement({
                ...engagementEditsToPatch,
                id: Number(engagementId),
            });
            setEngagement(updatedEngagement);
            dispatch(openNotification({ severity: 'success', text: 'Engagement Updated Successfully' }));
            setSaving(false);
            return Promise.resolve(updatedEngagement);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error Updating Engagement' }));
            setSaving(false);
            console.log(error);
            return Promise.reject(error);
        }
    };

    const handleUpdateEngagementMetadataRequest = async (
        engagement: EngagementFormUpdate,
    ): Promise<EngagementMetadata> => {
        setSaving(true);
        try {
            if (!savedEngagement.id) {
                dispatch(
                    openNotification({ severity: 'error', text: 'Please save the engagement before adding metadata' }),
                );
                setSaving(false);
                return engagementMetadata;
            }
            const state = { ...engagementMetadata };
            const engagementMetadataToUpdate: EngagementMetadata = {
                engagement_id: Number(engagementId),
                project_id: engagement.project_id,
                project_metadata: engagement.project_metadata,
            };
            const metadataDiff = diff(state, engagementMetadataToUpdate) as EngagementMetadata;
            const updatedEngagementMetadata = await patchEngagementMetadata({
                ...metadataDiff,
                engagement_id: Number(engagementId),
            });
            setEngagementMetadata(updatedEngagementMetadata);
            dispatch(openNotification({ severity: 'success', text: 'Engagement metadata saved successfully' }));
            setSaving(false);
            return Promise.resolve(updatedEngagementMetadata);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error saving engagement metadata' }));
            setSaving(false);
            console.log(error);
            return Promise.reject(error);
        }
    };

    return (
        <ActionContext.Provider
            value={{
                handleCreateEngagementRequest,
                handleUpdateEngagementRequest,
                handleCreateEngagementMetadataRequest,
                handleUpdateEngagementMetadataRequest,
                isSaving,
                savedEngagement,
                engagementMetadata,
                engagementId,
                loadingSavedEngagement,
                handleAddBannerImage,
                fetchEngagement,
                fetchEngagementMetadata,
            }}
        >
            {children}
        </ActionContext.Provider>
    );
};
