import React, { useContext, useState } from 'react';
import { MetPaper, MetBody, MetHeader4 } from 'components/common';
import { Grid, CircularProgress } from '@mui/material';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { WidgetTabValues } from '../type';
import { ActionContext } from '../../ActionContext';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppDispatch } from 'hooks';
import { WidgetType } from 'models/widget';
import { useCreateWidgetMutation } from 'apiManager/apiSlices/widgets';
import { Else, If, Then } from 'react-if';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';

export const optionCardStyle = {
    padding: '10px 2px 10px 2px',
    cursor: 'pointer',
    '&:hover': { backgroundColor: 'rgb(242, 242, 242)' },
    minHeight: '110px',
};

const PhasesOptionCard = () => {
    const { savedEngagement } = useContext(ActionContext);
    const { widgets, loadWidgets, handleWidgetDrawerTabValueChange } = useContext(WidgetDrawerContext);
    const dispatch = useAppDispatch();
    const [createWidget] = useCreateWidgetMutation();
    const [isCreatingWidget, setIsCreatingWidget] = useState(false);

    const handleCreateWidget = async () => {
        const alreadyExists = widgets.map((widget) => widget.widget_type_id).includes(WidgetType.Phases);
        if (alreadyExists) {
            handleWidgetDrawerTabValueChange(WidgetTabValues.PHASES_FORM);
            return;
        }

        try {
            setIsCreatingWidget(true);
            await createWidget({
                widget_type_id: WidgetType.Phases,
                engagement_id: savedEngagement.id,
            });
            await loadWidgets();
            dispatch(
                openNotification({
                    severity: 'success',
                    text: 'Widget successfully added.',
                }),
            );
            setIsCreatingWidget(false);
            handleWidgetDrawerTabValueChange(WidgetTabValues.PHASES_FORM);
        } catch (error) {
            setIsCreatingWidget(false);
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while adding phases widget' }));
        }
    };

    return (
        <MetPaper
            data-testid={`widget-drawer-option/${WidgetType.Phases}`}
            elevation={1}
            sx={optionCardStyle}
            onClick={() => handleCreateWidget()}
        >
            <If condition={isCreatingWidget}>
                <Then>
                    <Grid container alignItems="center" justifyContent="center" direction="row" height="5.5em">
                        <CircularProgress color="inherit" />
                    </Grid>
                </Then>
                <Else>
                    <Grid
                        container
                        alignItems="flex-start"
                        justifyContent="flex-start"
                        direction="row"
                        columnSpacing={2}
                        spacing={1}
                    >
                        <Grid item sx={{ mr: 0.5 }}>
                            <ChatBubbleOutlineOutlinedIcon color="info" sx={{ p: 0.5, fontSize: '4em' }} />
                        </Grid>
                        <Grid
                            container
                            item
                            alignItems="flex-start"
                            justifyContent="flex-start"
                            direction="row"
                            rowSpacing={1}
                            xs={8}
                        >
                            <Grid item xs={12}>
                                <MetHeader4>EA Process</MetHeader4>
                            </Grid>
                            <Grid item xs={12}>
                                <MetBody>Add the EA process info to this engagement</MetBody>
                            </Grid>
                        </Grid>
                    </Grid>
                </Else>
            </If>
        </MetPaper>
    );
};

export default PhasesOptionCard;
