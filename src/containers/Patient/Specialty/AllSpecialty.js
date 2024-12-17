import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { LANGUAGES, path } from '../../../utils';
import NumberFormat from 'react-number-format';
import './AllSpecialty.scss'
import HomeHeader from '../../HomePage/HomeHeader';
import { getAllSpecialty } from '../../../services/userService';
class AllSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
           listSpecialty:[]

        }
    }
    async componentDidMount() {
        let res = await getAllSpecialty();
        if(res&&res.errCode===0){
            this.setState({
                listSpecialty:res.data
            })
        }
    }
    async componentDidUpdate(prevProps, prevState, snaphot) {
      
    }
    handleClickSpecialty=(id)=>{
        this.props.history.push(path.DETAIL_SPECIALTY.replace(':id', id));
    }
    returnHome=()=>{
        this.props.history.push(path.HOMEPAGE)
    }
    render() {
        let {language} = this.props
        let {listSpecialty} = this.state
        return (
            <div className='all-specialty-container'>
                <HomeHeader />
                <div className='container'>
                    <div>
                        <p>
                            <i 
                                className="fas fa-home"
                                onClick={()=>this.returnHome()}
                            ></i>
                            <span> /{language===LANGUAGES.VI?'Khám chuyên khoa':'Specialist Consultation'}</span>
                        </p>
                    </div>
                    <div className='row'>
                        {listSpecialty.length>0 && listSpecialty.map((item,index)=>{
                            return(
                                <div 
                                    key={`spe-${index}`}
                                    className='col-xl-3 col-md-4 col-6 pb-3'
                                    onClick={()=>this.handleClickSpecialty(item.id)}
                                >
                                    <div className='img-spe' style={{ backgroundImage: `url(${item.image})` }}></div>
                                    <div className='text-center'>{item.nameVi}</div>
                                </div>
                            )
                        })
                        }
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllSpecialty);
