import React from 'react';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import EngagementForm from './EngagementForm';
import EngagementSettings from './EngagementSettings';
import { MetTab, MetTabList, MetTabPanel } from '../StyledTabComponents';
import { EngagementFormTabValues, ENGAGEMENT_FORM_TABS } from './constants';
import EngagementUserManagement from './EngagementUserManagement';

const FormTabs = () => {
    const [value, setValue] = React.useState<EngagementFormTabValues>(ENGAGEMENT_FORM_TABS.DETAILS);

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box>
                    <MetTabList
                        onChange={(_event: React.SyntheticEvent, newValue: EngagementFormTabValues) =>
                            setValue(newValue)
                        }
                        TabIndicatorProps={{
                            style: { transition: 'none', display: 'none' },
                        }}
                    >
                        <MetTab label="Engagement Details" value={ENGAGEMENT_FORM_TABS.DETAILS} />
                        <MetTab label="User Management" value={ENGAGEMENT_FORM_TABS.USER_MANAGEMENT} />
                        <MetTab label="Settings" value={ENGAGEMENT_FORM_TABS.SETTINGS} />
                    </MetTabList>
                </Box>
                <MetTabPanel value={ENGAGEMENT_FORM_TABS.DETAILS}>
                    <EngagementForm />
                </MetTabPanel>
                <MetTabPanel value={ENGAGEMENT_FORM_TABS.USER_MANAGEMENT}>
                    <EngagementUserManagement />
                </MetTabPanel>
                <MetTabPanel value={ENGAGEMENT_FORM_TABS.SETTINGS}>
                    <EngagementSettings />
                </MetTabPanel>
            </TabContext>
        </Box>
    );
};

export default FormTabs;
