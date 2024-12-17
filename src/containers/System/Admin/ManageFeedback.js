import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../utils';
import NumberFormat from 'react-number-format';
import { getFeedbackAdmin, putApproveFeedback ,getHistoryById} from '../../../services/userService';
import './ManageFeedback.scss';
import { toast } from 'react-toastify';
import { times } from 'lodash';
class ManageFeedback extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listFeedback: [],
            detailHistory:{}
        }
    }
    async componentDidMount() {
        this.getDataFeedback()
    }
    getDataFeedback = async () => {
        let { userInfo } = this.props;
        if (userInfo && userInfo.token) {
            let res = await getFeedbackAdmin(userInfo.token);
            if (res && res.errCode === 0) {
                this.setState({
                    listFeedback: res.data
                })
            }
        }

    }
    async componentDidUpdate(prevProps, prevState, snaphot) {

    }
    handleApprove = async (id) => {
        let res = await putApproveFeedback({
            id: id
        }, this.props.userInfo.token)
        if (res && res.errCode === 0) {
            this.getDataFeedback();
            toast.success("Approve succed!")
        } else {
            toast.error("Error")
        }
    }
    handleDetailHistory=async(id)=>{
        let res = await getHistoryById(id,this.props.userInfo.token)
        if(res&&res.errCode===0){
            console.log('sfs',res.data)
        }
    }
    render() {
        let { listFeedback } = this.state;
        let { language } = this.props
        return (
            <div className='manage-feedback-container container'>
                <div className='title'>
                    QUản lý phản hồi
                </div>
                <table className='table' style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th rowSpan={2}>STT</th>
                            <th colSpan={4}>Chất lượng (sao)</th>
                            <th rowSpan={2} className='detail'>Chi tiết</th>
                            <th rowSpan={2}>Hành động</th>
                        </tr>
                        <tr>
                            <th>Bác sĩ</th>
                            <th>TG chờ</th>
                            <th>Cơ sở</th>
                            <th>Nhân viên</th>
                           
                        </tr>

                    </thead>
                    <tbody>
                        {listFeedback && listFeedback.length > 0 ?
                            <>
                                {
                                    listFeedback.map((item, index) => {
                                        return (
                                            <tr key={`fb-${index}`}>
                                                <td>{index + 1}</td>
                                                <td>{item.doctorRating}</td>
                                                <td>{item.waitingTimeRating}</td>
                                                <td>{item.facilityRating}</td>
                                                <td>{item.staffRating}</td>
                                                <td>{item.comments}</td>
                                                <td>
                                                    <div className='d-flex' >
                                                        <button
                                                            onClick={() => this.handleApprove(item.id)}
                                                        >
                                                            Duyệt
                                                        </button>
                                                        <button
                                                            onClick={()=>this.handleDetailHistory(item.id)}
                                                        >
                                                            Chi tiết
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </>
                            : <tr>
                                <td colSpan={7}>No data</td>
                            </tr>
                        }
                    </tbody>
                </table>
                
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageFeedback);
