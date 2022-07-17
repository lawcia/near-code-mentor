# NEAR Smart Contract - Code Mentor
Website allows women to create amd receive code reviews. Get rewarded in NEAR.

Backend is hosted on the NEAR testnet 

Frontend is hosted on Netlify

## Tech
- rust
- react
- near js api

## Smart Contract

change to contract directory

```cd contract```

Login to near

```near login```

**Replace YOUR_ACCOUNT with your real account**

Create a sub account

```
near create-account code_mentor.YOUR_ACCOUNT.testnet --masterAccount YOUR_ACCOUNT.testnet
```


Deploy the contract

```
near deploy code_mentor.YOUR_ACCOUNT.testnet --wasmFile target/wasm32-unknown-unknown/release/code_mentor.wasm
```

Make a submission

params:

question - explain the problem you are trying to solve and what you need help with

language - this the coding language pick either (javascript, python, rust, or java)

code - this is the code snippet

```
near call code_mentor.code_mentor.testnet submit_code '{"submission_id": "1",
"submission_meta": {
    "language": "python",
    "code": "def hello():",
    "question": "help",
    "updated": "2022-07-17T08:31:58.933Z"
},
"account_id": "YOUR_ACCOUNT.testnet"
}' --accountId YOUR_ACCOUNT.testnet --amount 0.1
```

Get submissions for account

```
near call code_mentor.code_mentor.testnet submissions_for_account '"account_id": "YOUR_ACCOUNT.testnet"' --accountId code_mentor.testnet 
```

Get submissions to review

```
near call code_mentor.YOUR_ACCOUNT.testnet get_submissions_to_review '"account_id": "YOUR_ACCOUNT.testnet"' --accountId YOUR_ACCOUNT.testnet 
```

Submit a comment

```
near call code_mentor.YOUR_ACCOUNT.testnet submit_comment '{
    "comment_id": "1",
    "submission_id": "1",
"comment_meta": {
    "text": "OK",
    "updated": "2022-07-17T08:31:58.933Z"
},
"account_id": "YOUR_ACCOUNT.testnet"
}' --accountId YOUR_ACCOUNT.testnet
```

Delete sub account

```
near delete code_mentor.YOUR_ACCOUNT.testnet YOUR_ACCOUNT.testnet
```

## Frontend

Scripts

```yarn install```

```yarn start```

```yarn build```
