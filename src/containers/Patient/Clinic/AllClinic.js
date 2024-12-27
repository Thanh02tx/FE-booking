import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { LANGUAGES, path } from '../../../utils';
import NumberFormat from 'react-number-format';
import './AllClinic.scss'
import HomeHeader from '../../HomePage/HomeHeader';
import { getAllClinic, } from '../../../services/userService';
class AllClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
           listClinic:[]

        }
    }
    async componentDidMount() {
        let res = await getAllClinic();
        if(res&&res.errCode===0){
            this.setState({
                listClinic:res.data
            })
        }
    }
    async componentDidUpdate(prevProps, prevState, snaphot) {
      
    }
    handleClickClinic=(id)=>{
        this.props.history.push(path.DETAIL_CLINIC.replace(':id', id));
    }
    returnHome=()=>{
        this.props.history.push(path.HOMEPAGE)
    }
    render() {
        let {listClinic} = this.state
        let {language} = this.props
        return (
            <div className='all-clinic-container'>
                <HomeHeader />
                <div className='container'>
                    <div>
                        <p>
                            <i 
                                className="fas fa-home"
                                onClick={()=>this.returnHome()}
                            ></i>
                            <span> /{language===LANGUAGES.VI?'Cơ sở y tế':'Medical facility'}</span>
                        </p>
                    </div>
                    <div className='row'>
                        {listClinic.length>0 && listClinic.map((item,index)=>{
                            return(
                                <div 
                                    key={`spe-${index}`}
                                    className='col-xl-3 col-md-4 col-6 pb-3'
                                    onClick={()=>this.handleClickClinic(item.id)}
                                >
                                    <div className='img-spe' style={{ backgroundImage: `url(${item.image})` }}></div>
                                    <div className='text-center'>{item.name}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(AllClinic);
