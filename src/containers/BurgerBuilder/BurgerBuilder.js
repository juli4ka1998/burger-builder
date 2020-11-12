import React, {useCallback, useEffect, useState} from 'react';
import {connect, useDispatch, useSelector} from 'react-redux'
import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as burgerBuilderActions from '../../store/actions/index';


const BurgerBuilder = props => {
    const [purchasing, setPurchasing] = useState(false);

    const dispatch = useDispatch();

    const ings = useSelector(state => {
    	return state.burgerBuilder.ingredients;
	});
	const price = useSelector(state => {
		return state.burgerBuilder.totalPrice;
	});
	const error = useSelector(state => {
		return state.burgerBuilder.error;
	});
	const isAuthenticated = useSelector(state => {
		return state.auth.token !== null;
	});

	const onIngredientAdded = (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName));
	const onIngredientRemoved = (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName));
	const onInitIngredients = useCallback(() => dispatch(burgerBuilderActions.initIngredients()), [dispatch]);
	const onInitPurchase = () => dispatch(burgerBuilderActions.purchaseInit());
	const onSetAuthRedirectPath = (path) => dispatch(burgerBuilderActions.setAuthRedirectPath(path));

    useEffect(() => {
        onInitIngredients();
    }, [onInitIngredients]);


    const updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        return sum > 0
    };

    const purchaseHandler = () => {
        if (isAuthenticated) {
            setPurchasing(true);
        } else {
            onSetAuthRedirectPath('/checkout');
            props.history.push('/auth');
        }
    };

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    };

    const purchaseContinueHandler = () => {
        onInitPurchase();
        props.history.push('/checkout');
    };

    let orderSummary = null;

    const disableInfo = {
        ...ings
    };
    for (let key in disableInfo) {
        disableInfo[key] = disableInfo[key] <= 0
    }

    let burger = error ? <p>Ingredients can`t be loaded!</p> : <Spinner/>;

    if (ings) {
        burger = (
            <Auxiliary>
                <Burger ingredients={ings}/>
                <BuildControls
                    ingredientAdded={onIngredientAdded}
                    ingredientRemoved={onIngredientRemoved}
                    disabled={disableInfo}
                    purchasable={updatePurchaseState(ings)}
                    price={price}
                    ordered={purchaseHandler}
                    isAuth={isAuthenticated}
                />
            </Auxiliary>
        );
        orderSummary = <OrderSummary
            ingredients={ings}
            price={price}
            purchaseCancelled={purchaseCancelHandler}
            purchaseContinued={purchaseContinueHandler}
        />;
    }

    return (
        <Auxiliary>
            <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                {orderSummary}
            </Modal>
            {burger}
        </Auxiliary>
    );
};

export default withErrorHandler(BurgerBuilder, axios);
