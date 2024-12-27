import axios from "../axios";

const handleLoginApi = (userEmail, userPassword) => {
    return axios.post('/api/login', { email: userEmail, password: userPassword });
}
const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`);
}
const checkUserByEmail = (email) => {
    return axios.get(`/api/check-user-by-email?email=${email}`);
}
const sendMailOtp = (data) => {
    return axios.post(`/api/send-mail-otp`, data);
}
const resetPassword = (data) => {
    return axios.put(`/api/reset-password`, data);
}
const changePassword = (data, token) => {
    return axios.put(`/api/change-password`, data, {
        headers: {
            Authorization: `Bearer ${token}` // Gửi token trong header Authorization
        }
    });
}

const createNewUserService = (data) => {
    return axios.post('/api/create-new-user', data);
}
const deleteUserService = (userId) => {
    return axios.delete('/api/delete-user', {
        data: {
            id: userId
        }
    });
}
const editUserService = (inputData) => {
    return axios.put('/api/edit-user', inputData);
}
const editUserHome = (inputData) => {
    return axios.put('/api/edit-user-home', inputData);
}

const getAllCodeService = (inputType) => {
    return axios.get(`/api/allcode?type=${inputType}`);

}
const getTopDoctorHomeService = (limit) => {
    return axios.get(`/api/top-doctor-home?limit=${limit}`)
}
const getAllDoctors = () => {
    return axios.get(`/api/get-all-doctors`)
}
const saveDetailDoctor = (data) => {
    return axios.post(`/api/save-infor-doctor`, data)
}
const getInforDoctorById = (inputId) => {
    return axios.get(`/api/get-infor-doctor-by-id?id=${inputId}`)
}

const getDetailInforDoctor = (inputId) => {
    return axios.get(`/api/get-detail-doctor-by-id?id=${inputId}`)
}

const getScheduleDoctorByDate = (doctorId, date) => {
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`)
}

const getScheduleByToken = (token) => {
    return axios.get(`/api/get-schedule-by-token?token=${token}`)
}

const getExtraInforDoctorById = (doctorId) => {
    return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`)
}
const getProfileDoctorById = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`)
}
const postPatientBookAppointment = (data) => {
    return axios.post('/api/patient-book-appointment', data)
}
const postBookAppointmentNoSignIn = (data) => {
    return axios.post('/api/book-appointment-no-sign-in', data)
}


const postVerifyBookAppointment = (data) => {
    return axios.post('/api/verify-book-appointment', data)
}
const createNewSpecialty = (data) => {
    return axios.post('/api/create-new-specialty', data)
}
const getAllSpecialty = () => {
    return axios.get(`/api/get-all-specialty`)
}
const putEditSpecialty = (data) => {
    return axios.put(`/api/edit-specialty`, data)
}
const deleteSpecialty = (inputId) => {
    return axios.delete(`/api/delete-specialty`, {
        data: {
            id: inputId
        }
    })
}

const getAllCodeSpecialty = () => {
    return axios.get(`/api/get-allcode-specialty`)
}
const getDetailSpecialtyById = (data) => {
    return axios.get(`/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`)
}
const createNewClinic = (data) => {
    return axios.post('/api/create-new-clinic', data)
}
const getAllClinic = () => {
    return axios.get(`/api/get-all-clinic`)
}
const editClinic = (data) => {
    return axios.put(`/api/put-edit-clinic`, data)
}
const deleteClinic = (idInput) => {
    return axios.delete(`/api/delete-clinic`, {
        data: { id: idInput }
    })
}

const getDetailClinicById = (data) => {
    return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}&specialtyId=${data.specialtyId}`)
}

const createNewHandbook = (data) => {
    return axios.post('/api/create-new-handbook', data)
}
const getAllPatientForDoctor = (data, token) => {
    return axios.get(`/api/get-list-patient-for-doctor?date=${data.date}`, {
        headers: {
            Authorization: `Bearer ${token}` // Gửi token trong header Authorization
        }
    })
}

const postSendRemedy = (data, token) => {
    return axios.post('/api/send-remedy', data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
const getAllHandbook = (data) => {
    return axios.get('/api/get-all-handbook')
}
const putEditHandbook = (data) => {
    return axios.put('/api/put-edit-handbook', data)
}
const deleteHandbook = (inputId) => {
    return axios.delete('/api/delete-handbook', {
        data: {
            id: inputId
        }
    })
}
const getDetailHandbookById = (idInput) => {
    return axios.get(`/api/get-detail-handbook-by-id?id=${idInput}`)
}
const getAllProvinceJson = () => {
    return axios.get(`/api/get-all-province-json`)
}
const getAllDistrictJson = (idInput) => {
    console.log('sđf', idInput)
    return axios.get(`/api/get-all-district-json?id=${idInput}`)
}
const getAllWardJson = (idInput) => {
    return axios.get(`/api/get-all-ward-json?id=${idInput}`)
}
const getAllPatientRecord = (token) => {
    return axios.get(`/api/get-all-patient-record`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

const createNewPatientRecord = (data, token) => {
    return axios.post('/api/create-new-patient-record', data, {
        headers: {
            Authorization: `Bearer ${token}` // Gửi token trong header Authorization
        }
    });
}
const checkRoleAdmin = (token) => {
    return axios.post('/api/check-role-admin', null, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}
const checkRole = (token) => {
    return axios.post('/api/check-role', null, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}
const getBookingById = (id, token) => {
    return axios.get(`/api/get-booking-by-id?id=${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}
const updatePatientRecord = (data) => {
    return axios.put('/api/update-patient-record', data)
}

const getAllBookingAdmin = (data,token) => {
    return axios.post('/api/get-all-booking-admin',data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
const confirmAppointment = (id, token) => {
    return axios.put('/api/confirm-appointment', { id: id }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
const getAllBookingByPatientId = (id, token) => {
    return axios.get(`/api/get-booking-patient?id=${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}
const putPatientFeedback = (data, token) => {
    return axios.put(`/api/put-patient-feedback`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}
const getFeedbackAdmin = (token) => {
    return axios.get(`/api/get-feedback-admin`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}
const putApproveFeedback = (data,token) => {
    return axios.put(`/api/put-approve-feedback`,data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}
const getHistoryById = (id,token) => {
    return axios.get(`/api/get-history-by-id?id=${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}
const getAllUpcomingAppointment = (token) => {
    return axios.get(`/api/get-all-upcoming-appointment`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}
const cancelAppointment = (data,token) => {
    return axios.put(`/api/cancel-appointment`,data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}
const allScheduleDoctorByDate = (date,token) => {
    return axios.get(`/api/all-schedule-doctor-by-date?date=${date}`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}
const saveDoctorScheduleByDate = (data,token) => {
    return axios.post(`/api/save-doctor-schedule-by-date`,data,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}
const allScheduleByDateAndDoctorId = (data,token) => {
    return axios.get(`/api/all-schedule-by-date-and-doctorid?date=${data.date}&doctorId=${data.doctorId}`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}
const saveScheduleByDateAndDoctorId = (data,token) => {
    return axios.post(`/api/save-schedule-by-date-and-doctorid`,data,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}
const getCommentsByDoctorId = (data) => {
    return axios.get(`/api/get-comments-by-doctor-id?doctorId=${data.doctorId}`);
}
const postCreateComment = (data,token) => {
    return axios.post(`/api/post-create-comment`,data,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}


export {
    checkRole,
    checkRoleAdmin,
    handleLoginApi,
    getAllUsers,
    checkUserByEmail,
    sendMailOtp,
    resetPassword,
    changePassword,
    createNewUserService,
    deleteUserService,
    editUserService,
    editUserHome,
    getAllCodeService,
    getTopDoctorHomeService,
    getAllDoctors,
    saveDetailDoctor,
    getInforDoctorById,
    getDetailInforDoctor,
    getScheduleDoctorByDate,
    getScheduleByToken,
    getExtraInforDoctorById,
    getProfileDoctorById,
    postPatientBookAppointment,
    postBookAppointmentNoSignIn,
    postVerifyBookAppointment,
    createNewSpecialty,
    getAllSpecialty,
    putEditSpecialty,
    deleteSpecialty,
    getDetailSpecialtyById,
    createNewClinic,
    getAllClinic,
    getDetailClinicById,
    getAllCodeSpecialty,
    getAllPatientForDoctor,
    postSendRemedy,
    createNewHandbook,
    getAllHandbook,
    putEditHandbook,
    deleteHandbook,
    getDetailHandbookById,
    editClinic,
    deleteClinic,
    getAllProvinceJson,
    getAllDistrictJson,
    getAllWardJson,
    getAllPatientRecord,
    createNewPatientRecord,
    updatePatientRecord,
    getAllBookingAdmin,
    confirmAppointment,
    getBookingById,
    getAllBookingByPatientId,
    putPatientFeedback,
    getFeedbackAdmin,
    putApproveFeedback,
    getHistoryById,
    getAllUpcomingAppointment,
    cancelAppointment,
    allScheduleDoctorByDate,
    saveDoctorScheduleByDate,
    allScheduleByDateAndDoctorId,
    saveScheduleByDateAndDoctorId,
    getCommentsByDoctorId,
    postCreateComment
}
