import React from 'react';
import Auxiliary from '../../hoc/Auxiliary'
import Burger from '../../components/Burger/Burger'

function BurgerBuilder() {
	return (
		<Auxiliary>
			<Burger />
			<div>Build Controls</div>
		</Auxiliary>
	);
}

export default BurgerBuilder;
