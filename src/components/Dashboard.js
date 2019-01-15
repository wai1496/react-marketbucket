import React from 'react';
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Row, Col
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, Redirect } from 'react-router-dom'
import AddMarketplace from './AddMarketplace';
import axios from 'axios';

export default class Dashboard extends React.Component {

  state = {
    modal: false,
    lazada: localStorage.lazadaToken === "null" ? null : localStorage.lazadaToken,
    shopee: localStorage.shopeeShopId === "null" ? null : localStorage.shopeeShopId,
    lazadaCode: new URL(window.location.href).searchParams.get('code'),
    shopeeShopId: new URL(window.location.href).searchParams.get('shop_id'),
    lazadaShop: false,
    shopeeShop: false
  };

  toggleModal = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  toggleLazadaShop = () => {
    this.setState({
      lazadaShop:!this.state.lazadaShop
    })
  }

  toggleShopeeShop = () => {
    this.setState({
      shopeeShop:!this.state.shopeeShop
    })
  }

  componentDidMount = () => {
    if (this.state.lazadaCode && !this.state.lazada) {
      axios({
        method: 'post',
        url: 'http://127.0.0.1:5000/api/v1/marketplaces/authorize/lazada',
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${localStorage.jwt}`
        },
        data: {
          code: this.state.lazadaCode,
        }
      })
        .then(response => {
          const { data } = response;
          const { message, lazada_token, lazada_refresh } = data

          localStorage.setItem('lazadaToken', lazada_token)
          localStorage.setItem('lazadaRefresh', lazada_refresh)

          this.setState({
            lazadaCode: null
          })
        })
        .catch(error => {
          console.log(error)
          this.setState({ errors: error.response.data.message })
        });
    } else if (this.state.shopeeShopId && !this.state.shopee) {
      axios({
        method: 'post',
        url: 'http://127.0.0.1:5000/api/v1/marketplaces/authorize/shopee',
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${localStorage.jwt}`
        },
        data: {
          shop_id: this.state.shopeeShopId,
        }
      })
        .then(response => {
          const { data } = response;
          const { message, shopee_shop_id } = data

          localStorage.setItem('shopeeShopId', shopee_shop_id)

          this.setState({
            shopeeShopId: null
          })
        })
        .catch(error => {
          console.log(error)
          this.setState({ errors: error.response.data.message })
        });
    }
  }

  render() {
    const { modal, lazada, shopee, lazadaShop, shopeeShop } = this.state
      if (lazadaShop) {
        return <Redirect to='/lazada/shop' toggleLazadaShop={this.toggleLazadaShop} />;
      } else if (shopeeShop) {
        return <Redirect to='/shopee/shop' toggleShopeeShop={this.toggleShopeeShop} />;
      } else {
          return (
          <>
          {modal ? <AddMarketplace toggleModal={this.toggleModal} modal={modal} lazada={lazada} shopee={shopee} /> : null}
            <Col md='3' className='mb-auto ml-auto mr-auto mt-5'>
              <Card onClick={this.toggleModal} className='btn'>
                <div className='card-img-top border-bottom text-center pb-2'><FontAwesomeIcon icon="plus" size="7x" /></div>
                <CardBody>
                  <CardTitle className='text-center'><b>Add a marketplace</b></CardTitle>
                  <CardText className='text-left'>Choose the marketplace you would like to add and enter your credentials when prompted</CardText>
                </CardBody>
              </Card>
            </Col>
            {lazada ?
              <Col md='3' className='mb-auto ml-auto mr-auto mt-5'>
                <Card onClick={this.toggleLazadaShop} className='btn'>
                  <CardImg top width="100%" src="https://s3.amazonaws.com/market.bucket/Lazada.jpg" alt="Lazada" className='border-bottom pb-2'/>
                  <CardBody>
                    <CardTitle className='text-center'><b>Lazada</b></CardTitle>
                    <CardText>Manage your Lazada Store</CardText>
                  </CardBody>
                </Card>
              </Col>
              : null}
            {shopee ?
              <Col md='3' className='mb-auto ml-auto mr-auto mt-5'>
              <Card onClick={this.toggleShopeeShop} className='btn'>
                  <CardImg top width="100%" src="https://s3.amazonaws.com/market.bucket/Shopee.jpg" alt="Shopee" className='border-bottom pb-2' />
                  <CardBody>
                    <CardTitle className='text-center'><b>Shopee</b></CardTitle>
                    <CardText>Manage your Shopee Store</CardText>
                  </CardBody>
                </Card>
              </Col>
              : null}
          </>
        );
      }
  };
}