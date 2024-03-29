export class BaseResponse<T> {
    status: number;
    data: T;
    message: string;
}