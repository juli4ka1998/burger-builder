import React, { Component } from 'react';
import { connect } from 'react-redux'
import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as burgerBuilderActions from '../../store/actions/index';



export class BurgerBuilder extends Component {
	state = {
		purchasing: false,
	};

	componentDidMount() {
		this.props.onInitIngredients();
	}

	updatePurchaseState (ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
         return sum > 0
    }

  purchaseHandler = () => {
		if (this.props.isAuthenticated) {
			this.setState({purchasing: true})
		} else {
			this.props.onSetAuthRedirectPath('/checkout');
			this.props.history.push('/auth');
		}
  };

  purchaseCancelHandler = () => {
  	this.setState({purchasing: false})
  };

  purchaseContinueHandler = () => {
  	this.props.onInitPurchase();
	  this.props.history.push( '/checkout');
  };

	render() {
		let orderSummary = null;

		const disableInfo = {
			...this.props.ings
		};
		for (let key in disableInfo) {
			disableInfo[key] = disableInfo[key] <= 0
		}

		let burger = this.props.error ? <p>Ingredients can`t be loaded!</p> : <Spinner/>;

		if(this.props.ings) {
			burger = (
				<Auxiliary>
					<Burger ingredients={this.props.ings}/>
					<BuildControls
						ingredientAdded={this.props.onIngredientAdded}
						ingredientRemoved={this.props.onIngredientRemoved}
						disabled={disableInfo}
						purchasable={this.updatePurchaseState(this.props.ings)}
						price={this.props.price}
						ordered={this.purchaseHandler}
						isAuth={this.props.isAuthenticated}
					/>
				</Auxiliary>
			);
			orderSummary = <OrderSummary
				ingredients={this.props.ings}
				price={this.props.price}
				purchaseCancelled={this.purchaseCancelHandler}
				purchaseContinued={this.purchaseContinueHandler}
			/>;
		}

		return (
			<Auxiliary>
					<Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
						{orderSummary}
					</Modal>
				{burger}
			</Auxiliary>
		);
	}
}

const mapStateToProps = state => {
	return {
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		error: state.burgerBuilder.error,
		isAuthenticated: state.auth.token !== null
	}
};

const mapDispatchToProps = dispatch => {
	return {
		onIngredientAdded: (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)),
		onIngredientRemoved: (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName)),
		onInitIngredients: () => dispatch(burgerBuilderActions.initIngredients()),
		onInitPurchase: () => dispatch(burgerBuilderActions.purchaseInit()),
		onSetAuthRedirectPath: (path) => dispatch(burgerBuilderActions.setAuthRedirectPath(path))
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
