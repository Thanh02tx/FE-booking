import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { LANGUAGES, path } from '../../../utils';
import NumberFormat from 'react-number-format';
import './AllHandbook.scss'
import HomeHeader from '../../HomePage/HomeHeader';
import { getAllHandbook } from '../../../services/userService';
class AllHandbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
           listHandbook:[]

        }
    }
    async componentDidMount() {
        let res = await getAllHandbook();
        if(res&&res.errCode===0){
            let list = res.data.map(item => {
                item.image = new Buffer(item.image, 'base64').toString('binary');
                return item; 
            });
            
            this.setState({
                listHandbook:list
            })
        }
    }
    async componentDidUpdate(prevProps, prevState, snaphot) {
      
    }
    handleClickHandbook=(id)=>{
        this.props.history.push(path.DETAIL_HANDBOOK.replace(':id', id));
    }
    returnHome=()=>{
        this.props.history.push(path.HOMEPAGE)
    }
    render() {
        let {listHandbook} = this.state
        return (
            <div className='all-handbook-container'>
                <HomeHeader />
                <div className='container'>
                    <div>
                        <p>
                            <i 
                                className="fas fa-home"
                                onClick={()=>this.returnHome()}
                            ></i>
                            <span> /Cẩm nang</span>
                        </p>
                    </div>
                    <div className='row'>
                        {listHandbook.length>0 && listHandbook.map((item,index)=>{
                            return(
                                <div 
                                    key={`spe-${index}`}
                                    className='col-xl-3 col-md-4 col-6 pb-3'
                                    onClick={()=>this.handleClickHandbook(item.id)}
                                >
                                    <div className='img' style={{ backgroundImage: `url(${item.image})` }}></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(AllHandbook);
