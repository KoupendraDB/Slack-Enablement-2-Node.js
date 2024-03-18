export enum StatusCodes {
    Success = 200,
    Created = 201,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    Conflict = 409
}

export const TaskStatus = [
    'Ready',
    'In-Progress',
    'Code Review',
    'Deployed',
    'QA',
    'Rejected',
    'Blocked',
    'Accepted',
    'Cancelled'
]

export const DefaultTaskStatus = 'Ready';