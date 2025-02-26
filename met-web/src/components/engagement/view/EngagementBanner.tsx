import React, { useContext } from 'react';
import { ActionContext } from './ActionContext';
import { Grid, Skeleton } from '@mui/material';
import { Banner } from '../../banner/Banner';
import { PrimaryButton } from 'components/common';
import { EngagementBannerProps } from './types';
import { SubmissionStatus } from 'constants/engagementStatus';
import { useAppSelector } from 'hooks';
import { When } from 'react-if';
import EngagementInfoSection from './EngagementInfoSection';

export const EngagementBanner = ({ startSurvey }: EngagementBannerProps) => {
    const { isEngagementLoading, savedEngagement } = useContext(ActionContext);
    const surveyId = savedEngagement.surveys[0]?.id || '';
    const isOpen = savedEngagement.submission_status === SubmissionStatus.Open;
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const isPreview = isLoggedIn;

    if (isEngagementLoading) {
        return <Skeleton variant="rectangular" width="100%" height="35em" />;
    }

    return (
        <Banner imageUrl={savedEngagement.banner_url}>
            <EngagementInfoSection savedEngagement={savedEngagement}>
                <When condition={!!surveyId && (isOpen || isPreview)}>
                    <Grid item container direction={{ xs: 'column', sm: 'row' }} xs={12} justifyContent="flex-end">
                        <PrimaryButton data-testid="EngagementBanner/share-your-thoughts-button" onClick={startSurvey}>
                            Share your thoughts
                        </PrimaryButton>
                    </Grid>
                </When>
            </EngagementInfoSection>
        </Banner>
    );
};
