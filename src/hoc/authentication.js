import locationHelperBuilder from "redux-auth-wrapper/history4/locationHelper";
import { connectedRouterRedirect } from "redux-auth-wrapper/history4/redirect";

const locationHelper = locationHelperBuilder({});


// export const userIsAuthenticated = connectedRouterRedirect({
//     authenticatedSelector: state => {
//         const { isLoggedIn, userInfo } = state.user;
//         // Kiểm tra xem người dùng đã đăng nhập và có roleId hợp lệ
//         return isLoggedIn && (userInfo.roleId === 'R1' || userInfo.roleId === 'R2');
//     },
//     wrapperDisplayName: 'UserIsAuthenticated',
//     // Nếu là R3, chuyển đến /home, ngược lại chuyển đến /login
//     redirectPath: (state) => {
//         let roleId = state.user.userInfo.roleId;
//         return roleId === 'R3' ? '/home' : '/';
//     }
// });
export const userIsAuthenticated = connectedRouterRedirect({
    authenticatedSelector: state =>
        state.user.isLoggedIn && 
        (state.user.userInfo.roleId === 'R1' || state.user.userInfo.roleId === 'R2'),
    wrapperDisplayName: 'UserIsAuthenticated',
    redirectPath: '/login'
});
export const userIsNotAuthenticated = connectedRouterRedirect({
    // Want to redirect the user when they are authenticated
    authenticatedSelector: state => !state.user.isLoggedIn,
    wrapperDisplayName: 'UserIsNotAuthenticated',
    redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/',
    allowRedirectBack: false
});
// export const userIsNotAuthenticated = connectedRouterRedirect({
//     authenticatedSelector: state => !state.user.isLoggedIn,
//     wrapperDisplayName: 'UserIsNotAuthenticated',
//     redirectPath: (state) => {
//         if (state.user.isLoggedIn && state.user.userInfo.roleId === 'R3') {
//             return '/home'; // Người dùng R3 đã đăng nhập sẽ được chuyển hướng đến /home
//         }
//         else if(!state.user.isLoggedIn){
//             return '/login'; // Người dùng chưa đăng nhập sẽ được chuyển hướng đến /login
//         }
//     },
//     allowRedirectBack: false
// });