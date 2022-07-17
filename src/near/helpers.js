import { v4 as uuidv4 } from 'uuid';
import { Contract } from "near-api-js";
import { BN } from "bn.js";

import { SMART_CONTRACT } from './config';

export const initContract = () => {
    const account = window.walletConnection.getAccountId();

    let contract;

    if (!window.contractSettings?.[account]) {
        contract = new Contract(
            window.walletConnection.account(),
            SMART_CONTRACT,
            {
                viewMethods: ["submissions_for_account", "get_submissions_to_review"],
                changeMethods: ["submit_code", "submit_comment"],
            }
        );
        window.contractSettings = { account: contract };
    } else {
        contract = window.contractSettings[account];
    }

    return contract;
};

export const submitCode = async ({ language, code, question }) => {
    const account = window.walletConnection.getAccountId();
    const contract = initContract();
    return contract.submit_code({
        submission_id: uuidv4(),
        submission_meta: {
            language,
            code,
            question,
            updated: new Date().toISOString()
        },
        account_id: account
    },
        300000000000000,
        new BN("1000000000000000000000000")
    )
}

export const getMySubmissions = async () => {
    const account = window.walletConnection.getAccountId();
    const contract = initContract();
    return contract.submissions_for_account({
        account_id: account
    });
}

export const getSubmissionsToReview = async () => {
    const account = window.walletConnection.getAccountId();
    const contract = initContract();
    return contract.get_submissions_to_review({
        account_id: account
    });
}

export const submitComment = async ({ text, submissionId }) => {
    const account = window.walletConnection.getAccountId();
    const contract = initContract();
    return contract.submit_comment({
        submission_id: submissionId,
        comment_id: uuidv4(),
        comment_meta: {
            text,
            updated: new Date().toISOString()
        },
        account_id: account
    },
        300000000000000,
        new BN("1000000000000000000000000")
    )
}
