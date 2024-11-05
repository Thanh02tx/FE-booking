import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/HomeHeader';
import './DetailHandbook.scss';
import { getDetailHandbookById } from '../../../services/userService';
import _ from 'lodash';
import { LANGUAGES, path } from '../../../utils';
import './DetailHandbook.scss'
class DetailHandbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataDetailHandbook: {},
        }
    }
    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;

            let res = await getDetailHandbookById(id)

            if (res && res.errCode === 0) {
                this.setState({
                    dataDetailHandbook: res.data,
                })
            }
        }
    }
    async componentDidUpdate(prevProps, prevState, snaphot) {

    }
    returnAllHandbook=()=>{
        this.props.history.push(path.ALL_HANDBOOK)
    }
    returnHome=()=>{
        this.props.history.push(path.HOMEPAGE)
    }

    render() {

        let { language } = this.props;
        let { dataDetailHandbook } = this.state;
        let listHeading = dataDetailHandbook.Handbook_Contents ? dataDetailHandbook.Handbook_Contents : []
        console.log('đf', this.state)
        return (
            <div className='detail-handbook'>
                <HomeHeader />
                <div className='container '>
                    <div className='content row'>
                        <div className=' bg-white content-left col-md-8'>
                            <div>
                                <p className='hb-nav m-0'>
                                    <i
                                        className="fas fa-home"
                                        onClick={() => this.returnHome()}
                                    ></i>
                                    <span
                                        onClick={()=>this.returnAllHandbook()}
                                    > /Cẩm nang</span>
                                </p>
                            </div>
                            <div className='image-handbook' style={{
                                backgroundImage: `url(${dataDetailHandbook && dataDetailHandbook.image ? dataDetailHandbook.image : ''})`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                                backgroundSize: 'cover',
                                width: '100%',  // Chiều rộng chiếm 100% phần tử chứa nó
                                paddingTop: '56.25%'
                            }}>
                                {/* <p>
                                    <i
                                        className="fas fa-home"
                                        onClick={() => this.returnHome()}
                                    ></i>
                                    <span> /Cẩm nang</span>
                                </p> */}
                            </div>
                            <div className='m-3'>
                                <h4 >{dataDetailHandbook.nameVi}</h4>
                                {listHeading.length > 0 &&
                                    listHeading.map((item, index) => {
                                        return (
                                            <div key={`l-${index}`}>
                                                <div className='title-heading' id={`heading-${item.id}`}>{item.headingVi}</div>
                                                <div
                                                    dangerouslySetInnerHTML={{ __html: item.contentHTMLVi }}
                                                />
                                            </div>
                                        )
                                    })
                                }

                            </div>
                        </div>
                        <div className='hide col-md-1'></div>
                        <div className=' bg-white content-right col-md-3 mb-4'>
                            <div className='m-1'>
                                <div className='my-2'><p className='title-right'>Nội dung chính</p></div>
                                {listHeading.length > 0 &&
                                    listHeading.map((item, index) => {
                                        return (
                                            <div className='mb-1' key={`r-${index}`}>
                                                <a href={`#heading-${item.id}`} > {item.headingVi}</a>

                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>

                </div>

                <div className='detail-specialty-body '>



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

export default connect(mapStateToProps, mapDispatchToProps)(DetailHandbook);
