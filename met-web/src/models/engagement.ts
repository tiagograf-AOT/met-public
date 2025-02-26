import { Survey, SurveySubmissionData } from './survey';
import { EngagementStatusBlock } from './engagementStatusBlock';
import { SubmissionStatus } from 'constants/engagementStatus';

export interface Engagement {
    id: number;
    name: string;
    description: string;
    rich_description: string;
    status_id: number;
    start_date: string;
    end_date: string;
    published_date: string | null;
    user_id: string;
    created_date: string;
    updated_date: string;
    scheduled_date: string;
    content: string;
    rich_content: string;
    banner_url: string;
    banner_filename: string;
    surveys: Survey[];
    engagement_status: Status;
    submission_status: SubmissionStatus;
    submissions_meta_data: SurveySubmissionData;
    status_block: EngagementStatusBlock[];
    is_internal: boolean;
}

export interface Status {
    id: number;
    status_name: string;
}

export interface EngagementMetadata {
    engagement_id: number;
    project_id: string;
    project_metadata: ProjectMetadata;
}

export interface ProjectMetadata {
    project_name: string;
    type: string;
    client_name: string;
    application_number: string;
}

export const createDefaultEngagement = (): Engagement => {
    return {
        id: 0,
        name: '',
        description: '',
        rich_description: '',
        status_id: 0,
        start_date: '',
        end_date: '',
        published_date: '',
        scheduled_date: '',
        user_id: '',
        created_date: '',
        updated_date: '',
        banner_url: '',
        banner_filename: '',
        content: '',
        rich_content: '',
        engagement_status: { id: 0, status_name: '' },
        surveys: [],
        submission_status: SubmissionStatus.Upcoming,
        submissions_meta_data: {
            total: 0,
            pending: 0,
            needs_further_review: 0,
            rejected: 0,
            approved: 0,
        },
        status_block: [],
        is_internal: false,
    };
};

export const createDefaultEngagementMetadata = (): EngagementMetadata => {
    return {
        engagement_id: 0,
        project_id: '',
        project_metadata: {
            client_name: '',
            type: '',
            project_name: '',
            application_number: '',
        },
    };
};
