import React, { useContext } from 'react';
import Grid from '@mui/material/Grid';
import { MetHeader2, MetHeader4, MetPageGridContainer } from 'components/common';
import { Accordion, AccordionDetails, AccordionSummary, Skeleton, styled } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EngagementAccordion from './EngagementsAccordion';
import { SubmissionStatus } from 'constants/engagementStatus';
import { DashboardContext } from './DashboardContext';
import { Palette } from 'styles/Theme';

const EngagementList = () => {
    const { engagements, isLoading } = useContext(DashboardContext);
    const openEngagements = engagements.filter((engagement) => engagement.submission_status == SubmissionStatus.Open);
    const upcomingEngagements = engagements.filter(
        (engagement) => engagement.submission_status == SubmissionStatus.Upcoming,
    );
    const lastMonthDate = new Date(new Date().setDate(new Date().getDate() - 30));
    const recentlyClosedEngagements = engagements.filter(
        (engagement) =>
            engagement.submission_status == SubmissionStatus.Closed && new Date(engagement.end_date) >= lastMonthDate,
    );
    const oldClosedEngagements = engagements.filter(
        (engagement) =>
            engagement.submission_status == SubmissionStatus.Closed && new Date(engagement.end_date) < lastMonthDate,
    );

    const StyledAccordion = styled(Accordion)({
        border: 'solid 1px #cdcdcd',
        boxShadow:
            'rgb(0 0 0 / 6%) 0px 2px 2px -1px, rgb(0 0 0 / 6%) 0px 1px 1px 0px, rgb(0 0 0 / 6%) 0px 1px 3px 0px;',
    });

    if (isLoading) {
        return <Skeleton variant="rectangular" width="100%" height="35em" />;
    }

    return (
        <MetPageGridContainer
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            container
            columnSpacing={2}
            rowSpacing={3}
        >
            <Grid item xs={12}>
                <MetHeader2>Engagements Dashboard</MetHeader2>
            </Grid>
            <Grid item xs={12}>
                <StyledAccordion defaultExpanded={true}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ flexDirection: 'row-reverse' }}>
                        <MetHeader4>Upcoming Engagements</MetHeader4>
                    </AccordionSummary>
                    <AccordionDetails>
                        <EngagementAccordion
                            engagements={upcomingEngagements}
                            bgColor={Palette.dashboard.upcoming.bg}
                            borderColor={Palette.dashboard.upcoming.border}
                            disabled={true}
                        />
                    </AccordionDetails>
                </StyledAccordion>
            </Grid>
            <Grid item xs={12}>
                <StyledAccordion defaultExpanded={true}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ flexDirection: 'row-reverse' }}>
                        <MetHeader4>Open Engagements</MetHeader4>
                    </AccordionSummary>
                    <AccordionDetails>
                        <EngagementAccordion
                            engagements={openEngagements}
                            bgColor={Palette.dashboard.open.bg}
                            borderColor={Palette.dashboard.open.border}
                        />
                    </AccordionDetails>
                </StyledAccordion>
            </Grid>
            <Grid item xs={12}>
                <StyledAccordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ flexDirection: 'row-reverse' }}>
                        <MetHeader4>Recently Closed Engagements (last 30 days)</MetHeader4>
                    </AccordionSummary>
                    <AccordionDetails>
                        <EngagementAccordion
                            engagements={recentlyClosedEngagements}
                            bgColor={Palette.dashboard.closed.bg}
                            borderColor={Palette.dashboard.closed.border}
                        />
                    </AccordionDetails>
                </StyledAccordion>
            </Grid>
            <Grid item xs={12}>
                <StyledAccordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ flexDirection: 'row-reverse' }}>
                        <MetHeader4>Closed Engagements (over 30 days ago)</MetHeader4>
                    </AccordionSummary>
                    <AccordionDetails>
                        <EngagementAccordion
                            engagements={oldClosedEngagements}
                            bgColor={Palette.dashboard.closed.bg}
                            borderColor={Palette.dashboard.closed.border}
                        />
                    </AccordionDetails>
                </StyledAccordion>
            </Grid>
        </MetPageGridContainer>
    );
};

export default EngagementList;
