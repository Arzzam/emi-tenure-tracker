export interface IUser {
    id: string;
    email: string;
    rawData: Record<string, unknown>;
    metadata: Record<string, unknown>;
}

const userModel = {
    state: <IUser>{},
    reducers: {
        setUser: (_: IUser, user: IUser) => {
            return user;
        },
    },
};

export default userModel;
