import locationHelperBuilder from "redux-auth-wrapper/history4/locationHelper";
import { connectedRouterRedirect } from "redux-auth-wrapper/history4/redirect";
import { checkRoleAdmin,checkRole } from "../services/userService";
import { path } from "../utils";
const locationHelper = locationHelperBuilder({});
export const userIsAuthenticated = connectedRouterRedirect({
    authenticatedSelector: state => state.user.isLoggedIn,
    wrapperDisplayName: 'UserIsAuthenticated',
    redirectPath: '/login'
});

export const userIsNotAuthenticated = connectedRouterRedirect({
    // Want to redirect the user when they are authenticated
    authenticatedSelector: state => !state.user.isLoggedIn,
    wrapperDisplayName: 'UserIsNotAuthenticated',
    redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/',
    allowRedirectBack: true
});

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
// export const userIsAuthenticated = connectedRouterRedirect({
//     authenticatedSelector: state =>
//         state.user.isLoggedIn && 
//         (state.user.userInfo.roleId === 'R1' || state.user.userInfo.roleId === 'R2'),
//     wrapperDisplayName: 'UserIsAuthenticated',
//     redirectPath: '/login'
// });
// export const adminIsAuthenticated = connectedRouterRedirect({
//     authenticatedSelector: async (state) => {
//         if (!state.user.isLoggedIn) return false; // Nếu chưa đăng nhập, trả về false
//         const token = state.user.userInfo.token; 
//         try {
//             let res = await checkRoleAdmin(token);  // Gọi API để kiểm tra quyền admin
//             if (res && res.errCode === 0) {
//                 return res.check;  // Nếu kiểm tra thành công và có quyền, trả về true/false tùy vào giá trị check
//             } else {
//                 return false;  // Nếu không có quyền admin hoặc có lỗi, trả về false
//             }
//         } catch (error) {
//             console.error('Error checking role:', error);
//             return false;  // Nếu có lỗi trong quá trình kiểm tra quyền, trả về false
//         }
//     },
//     wrapperDisplayName: 'adminIsAuthenticated',
//     redirectPath: '/login',  // Nếu không được xác thực, điều hướng đến trang login
// });
export const adminIsAuthenticated = connectedRouterRedirect({
    authenticatedSelector:async (state) => {
        // Kiểm tra nếu người dùng đã đăng nhập và có quyền admin
        if (!state.user.isLoggedIn) return false;
        const token = state.user.userInfo.token;
        try {
            let res = await checkRoleAdmin(token);  // Gọi API để kiểm tra quyền admin
            if (res && res.errCode === 0) {
                return res.check;  // Nếu kiểm tra thành công và có quyền, trả về true/false tùy vào giá trị check
            } else {
                return false;  // Nếu không có quyền admin hoặc có lỗi, trả về false
            }
        } catch (error) {
            console.error('Error checking role:', error);
            return false;  // Nếu có lỗi trong quá trình kiểm tra quyền, trả về false
        }
    },
    wrapperDisplayName: 'adminIsAuthenticated',
    redirectPath: '/login',  // Nếu không được xác thực, điều hướng đến trang login
});

// export const userIsNotAuthenticated = connectedRouterRedirect({
//     // Want to redirect the user when they are authenticated
//     authenticatedSelector: state => !state.user.isLoggedIn,
//     wrapperDisplayName: 'UserIsNotAuthenticated',
//     redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || path.LOGIN,
//     allowRedirectBack: false
// });
// export const userIsAuthenticated = connectedRouterRedirect({
//     authenticatedSelector: state => state.user.isLoggedIn,
//     wrapperDisplayName: 'UserIsAuthenticated',
//     redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || path.SYSTEM,
//     allowRedirectBack: false
// });
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