export const LOGIN_USER_STARTED = 'LOGIN_USER_STARTED';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_FAILD = 'LOGIN_USER_FAILD';

interface LoginUserStarted {
    type: typeof LOGIN_USER_STARTED;
}

interface LoginUserSuccess {
    type: typeof LOGIN_USER_SUCCESS;
    payload: {
        data: any;
    };
}

interface LoginUserFailure {
    type: typeof LOGIN_USER_FAILD;
    payload: {
        data: any;
    };
}

export type ProjectActionTypes =
    | LoginUserStarted
    | LoginUserSuccess
    | LoginUserFailure;