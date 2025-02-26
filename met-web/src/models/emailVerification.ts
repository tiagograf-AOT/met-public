export interface EmailVerification {
    email_address: string;
    survey_id: number;
    type: EmailVerificationType;
}

export enum EmailVerificationType {
    Survey = 0,
    EditSubmission = 1,
    Subscribe = 2,
}
