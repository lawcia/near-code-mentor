use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap, UnorderedMap, UnorderedSet};
use near_sdk::{
    env, near_bindgen, AccountId, Balance, Promise,
};
use near_sdk::serde::{Deserialize, Serialize};

use crate::internal::*;

mod internal;


pub type SubmissionId = String;
pub type CommentId = String;

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Submission {
    pub language: String,         
    pub code: String,           
    pub question: String,
    pub account: AccountId,
    pub updated: String,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct SubmissionMeta {
    pub language: String,         
    pub code: String,           
    pub question: String,
    pub updated: String,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Comment {
    pub text: String,
    pub account: AccountId,
    pub updated: String,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct CommentMeta {
    pub text: String,
    pub updated: String,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct JsonToken{
    pub id: SubmissionId,
    pub submission: Submission,
    pub comments: Vec<Comment>,
}

// add the following attributes to prepare your code for serialization and invocation on the blockchain
// More built-in Rust attributes here: https://doc.rust-lang.org/reference/attributes.html#built-in-attributes-index
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    // See more data types at https://doc.rust-lang.org/book/ch03-02-data-types.html
    pub submissions_per_account: UnorderedMap<AccountId, UnorderedSet<SubmissionId>>,

    pub submissions_by_id: LookupMap<SubmissionId, Submission>,

    pub comments_per_submission: LookupMap<SubmissionId, UnorderedSet<CommentId>>,

    pub comments_by_id: LookupMap<CommentId, Comment>,
}

/// Helper structure for keys of the persistent collections.
#[derive(BorshSerialize)]
pub enum StorageKey {
    SubmissionsPerAccount,
    SubmissionsById,
    CommentsPerSubmission,
    CommentsById,
}

impl Default for Contract {
    fn default() -> Self{
        Self {
            submissions_per_account: UnorderedMap::new(StorageKey::SubmissionsPerAccount.try_to_vec().unwrap()),

            submissions_by_id: LookupMap::new(StorageKey::SubmissionsById.try_to_vec().unwrap()),

            comments_per_submission: LookupMap::new(StorageKey::CommentsPerSubmission.try_to_vec().unwrap()),

            comments_by_id: LookupMap::new(StorageKey::CommentsById.try_to_vec().unwrap()),
        }
    }
}

#[near_bindgen]
impl Contract {
    #[payable]
    pub fn submit_code(
        &mut self,
        submission_id: SubmissionId,
        submission_meta: SubmissionMeta,
        account_id: AccountId,
    ) {
        let initial_storage_usage = env::storage_usage();

        let signer_account_id = env::signer_account_id();

        assert!(account_id == signer_account_id, 
        "Signer account ID should match account_id in payload");

        let submission = Submission {
            language: submission_meta.language,         
            code: submission_meta.code,           
            question: submission_meta.question,
            updated: submission_meta.updated,
            account: account_id.clone(),
        };

        assert!(
            self.submissions_by_id.insert(&submission_id, &submission).is_none(),
            "Submission already exists"
        );

        // get the set of submissions for the given account
        let mut submissions_set = self.submissions_per_account.get(&account_id).unwrap_or_else(|| {
            // if the account doesn't have any submissions, we create a new unordered set
            UnorderedSet::new(
                StorageKey::SubmissionsPerAccount.try_to_vec()
                .unwrap(),
            )
        });

        // we insert the submission ID into the set
        submissions_set.insert(&submission_id);

        // we insert that set for the given account ID. 
        self.submissions_per_account.insert(&account_id, &submissions_set);

        let required_storage_in_bytes = env::storage_usage() - initial_storage_usage;

        // refund any excess storage if the user attached too much. Panic if they didn't attach enough to cover the required.
        refund_deposit(required_storage_in_bytes);
    }
    
    #[payable]
    pub fn submit_comment(
        &mut self,
        comment_id: CommentId,
        comment_meta: CommentMeta,
        submission_id: SubmissionId,
        account_id: AccountId,
    ) -> Promise {
        let signer_account_id = env::signer_account_id();

        assert!(account_id == signer_account_id, 
            "Signer account ID should match account_id in payload");    

        let comment = Comment {
            text: comment_meta.text,
            account: account_id.clone(),
            updated: comment_meta.updated,
        };

        assert!(
            self.comments_by_id.insert(&comment_id, &comment).is_none(),
            "Comment already exists"
        );

        // get the set of comments for the given account
        let mut comments_set = self.comments_per_submission.get(&submission_id).unwrap_or_else(|| {
            // if the submission doesn't have any comments, we create a new unordered set
            UnorderedSet::new(
                StorageKey::CommentsPerSubmission.try_to_vec()
                .unwrap(),
            )
        });


        comments_set.insert(&comment_id);

        self.comments_per_submission.insert(&submission_id, &comments_set);

        let amount: u128 = 1_000_000_000_000_000_000_000_000; // 1 $NEAR as yoctoNEAR

        Promise::new(account_id).transfer(amount)
    }

    pub fn submissions_for_account(
        &self,
        account_id: AccountId,
    ) -> Vec<JsonToken> {
        let submissions = self.get_submission_by_account_id(account_id);

        return submissions
    }


    fn get_submission_by_account_id(
        &self,
        account_id: AccountId,
    ) -> Vec<JsonToken> {
        let submissions_for_owner_set = self.submissions_per_account.get(&account_id);

        let submissions = if let Some(submissions_for_owner_set) = submissions_for_owner_set {
            submissions_for_owner_set
        } else {
            return vec![];
        };

        // iterate through the keys vector
        return submissions.iter()
            .map(|submission_id| self.get_submission_by_id(submission_id.clone()).unwrap())
            .collect()
    }

    fn get_submission_by_id(&self, submission_id: SubmissionId) -> Option<JsonToken> {
 
        if let Some(submission) = self.submissions_by_id.get(&submission_id) {

            let comments_for_submission_set = self.comments_per_submission.get(&submission_id);

            let comments = if let Some(comments_for_submission_set) = comments_for_submission_set {
                comments_for_submission_set
            } else {
                UnorderedSet::new(
                    StorageKey::CommentsPerSubmission.try_to_vec()
                    .unwrap(),
                )
            };

            let comments_json = comments.iter()
            .map(|comment_id| self.get_comment_by_id(comment_id.clone()).unwrap())
            .collect();

            Some(JsonToken {
                id: submission_id,
                submission,
                comments: comments_json
            })
        } else { 
            None
        }
    }

    fn get_comment_by_id(&self, comment_id: CommentId) -> Option<Comment> {
         if let Some(comment) = self.comments_by_id.get(&comment_id) {
            Some(comment)
        } else {
            None
        }
    }

    pub fn get_submissions_to_review(
        &self,
        account_id: AccountId,
    ) -> Vec<JsonToken> {
        let keys = self.submissions_per_account.keys_as_vector();

        let mut submissions = Vec::new();

        let account_ids: Vec<AccountId> = keys.iter()
        .filter(|acc| acc != &account_id).collect();
        
        for acc_id in &account_ids {
            let mut submission = self.get_submission_by_account_id(acc_id.clone());
            submissions.append(&mut submission);
        }

        submissions
    }
}