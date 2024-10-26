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
    return axios.post(`/api/send-mail-otp`,data);
}
const resetPassword = (data) => {
    return axios.put(`/api/reset-password`,data);
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
const saveBulkScheduleDoctor = (data) => {
    return axios.post(`/api/bulk-create-schedule`, data)
}

const getScheduleDoctorByDate = (doctorId, date) => {
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`)
}
const getExtraInforDoctorById = (doctorId) => {
    return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`)
}
const getProfileDoctorById = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`)
}
const postPatientBookAppointment=(data)=>{
    return axios.post('/api/patient-book-appointment',data)
}
const postVerifyBookAppointment=(data)=>{
    return axios.post('/api/verify-book-appointment',data)
}
const createNewSpecialty=(data)=>{
    return axios.post('/api/create-new-specialty',data)
}
const getAllSpecialty = () => {
    return axios.get(`/api/get-all-specialty`)
}
const putEditSpecialty = (data) => {
    return axios.put(`/api/edit-specialty`,data)
}
const deleteSpecialty = (inputId) => {
    return axios.delete(`/api/delete-specialty`,{
        data:{
            id:inputId
        }
    })
}

const getAllCodeSpecialty = () => {
    return axios.get(`/api/get-allcode-specialty`)
}
const getDetailSpecialtyById = (data) => {
    return axios.get(`/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`)
}
const createNewClinic=(data)=>{
    return axios.post('/api/create-new-clinic',data)
}
const getAllClinic = () => {
    return axios.get(`/api/get-all-clinic`)
}
const editClinic = (data) => {
    return axios.put(`/api/put-edit-clinic`,data)
}
const deleteClinic = (idInput) => {
    return axios.delete(`/api/delete-clinic`,{
        data:{id:idInput}
    })
}

const getDetailClinicById = (data) => {
    return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}&specialtyId=${data.specialtyId}`)
}

const createNewHandbook = (data) => {
    return axios.post('/api/create-new-handbook',data)
}
const getAllPatientForDoctor = (data) => {
    return axios.get(`/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`)
}

const postSendRemedy = (data) => {
    return axios.post('/api/send-remedy',data)
}
const getAllHandbook = (data) => {
    return axios.get('/api/get-all-handbook')
}
const putEditHandbook = (data) => {
    return axios.put('/api/put-edit-handbook',data)
}
const deleteHandbook = (inputId) => {
    return axios.delete('/api/delete-handbook',{
        data :{
            id:inputId
        }
    })
}
const getDetailHandbookById = (idInput) => {
    return axios.get(`/api/get-detail-handbook-by-id?id=${idInput}`)
}

export {
    handleLoginApi,
    getAllUsers,
    checkUserByEmail,
    sendMailOtp,
    resetPassword,
    createNewUserService,
    deleteUserService,
    editUserService,
    getAllCodeService,
    getTopDoctorHomeService,
    getAllDoctors,
    saveDetailDoctor,
    getInforDoctorById,
    getDetailInforDoctor,
    saveBulkScheduleDoctor,
    getScheduleDoctorByDate,
    getExtraInforDoctorById,
    getProfileDoctorById,
    postPatientBookAppointment,
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
    deleteClinic

}
