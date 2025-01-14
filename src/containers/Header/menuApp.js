// export const adminMenu = [
//     { //người dùng
//         name: 'menu.admin.manage-user',
//         menus: [
//             {
//                 name: 'menu.admin.crud', link: '/system/user-manage'
//             },
//             {
//                 name: 'menu.admin.crud-redux', link: '/system/user-redux'
//             },
//             {
//                 name: 'menu.admin.manage-doctor', link: '/system/manage-doctor'
//             },
//             {
//                 name: 'menu.admin.manage-booking', link: '/system/manage-booking'
//             },
//             {
//                 name: 'menu.doctor.manage-schedule', link: '/system/manage-schedule'
//             }
//             ,
//             {
//                 name: 'menu.admin.new-appointment', link: '/system/manage-new-appointment'
//             }


//         ]
//     },
//     {// phòng khám appointment
//         name: 'menu.admin.patient',
//         menus: [
//             {
//                 name: 'menu.admin.manage-feedback', link: '/system/manage-feedback'
//             }
//         ]
//     },
//     {// phòng khám 
//         name: 'menu.admin.clinic',
//         menus: [
//             {
//                 name: 'menu.admin.manage-clinic', link: '/system/manage-clinic'
//             }
//         ]
//     },
//     {// chuyên khoa
//         name: 'menu.admin.specialty',
//         menus: [
//             {
//                 name: 'menu.admin.manage-specialty', link: '/system/manage-specialty'
//             }
//         ]
//     },
//     {// cẩm nang
//         name: 'menu.admin.handbook',
//         menus: [
//             {
//                 name: 'menu.admin.manage-handbook', link: '/system/manage-handbook'
//             }
//         ]
//     }
// ];

// export const doctorMenu = [
//     { //quản lý kế haocj khám bệnh bác sĩ
//         name: 'menu.admin.manage-user',
//         menus: [
//             {
//                 name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule'
//             },
//             {
//                 name: 'menu.doctor.manage-patient', link: '/doctor/manage-patient'
//             },
//         ]

//     },
// ];
export const adminMenu = [
    {
        name: 'menu.admin.manage-user', link: '/system/user-manage'
    },
    {
        name: 'menu.admin.manage-doctor', link: '/system/manage-doctor'
    },
    {
        name: 'menu.doctor.manage-schedule', link: '/system/manage-schedule'
    }
    ,
    {
        name: 'menu.admin.manage-clinic', link: '/system/manage-clinic'
    },
    {
        name: 'menu.admin.specialty', link: '/system/manage-specialty'
    },
    {
        name: 'menu.admin.handbook', link: '/system/manage-handbook'
    },
    {
        name: 'menu.admin.manage-booking', link: '/system/manage-booking'
    },
    
    {
        name: 'menu.admin.new-appointment', link: '/system/manage-new-appointment'
    },
    {
        name: 'menu.admin.manage-feedback', link: '/system/manage-feedback'
    }
];

export const doctorMenu = [
    {
        name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule'
    },
    {
        name: 'menu.doctor.manage-patient', link: '/doctor/manage-patient'
    },
];