const LOAD_NUM = 4;
let watcher;


new Vue({
		el: "#app",
		/**/
		// Data
		/**/
		data: {
			total: 0,
			products: [],
			results: [],
			cart: [],
			search: "cat",
			lastSearch: "",
			loading: false
		},
		/**/
		// Methods
		/**/
		methods: {
			// Add to cart
			addToCart: function(product) {
				this.total += product.price;

				let found = false;

				for (var i = 0; i < this.cart.length; i++){
					if (this.cart[i].id === product.id) {
						this.cart[i].qty++;
						found = true;
					}
				}

				if (!found){
					this.cart.push({
						id: product.id,
						title: product.title,
						price: product.price,
						qty: 1
					});
				}
			},
			// Increment
			inc: function(item){
				item.qty++;
				this.total += item.price;
			},
			// Decrement
			dec: function(item){
				if (item.qty === 1) {
					let index = this.cart.indexOf(item);
					if (index > -1) {
						this.total -= item.price;
						this.cart.splice(index, 1);
					}
					return;
				}

				item.qty--;
				this.total -= item.price;
			},
			// onSubmit
			onSubmit: function() {
				this.products = [];
				this.results = [];
				this.loading = true;
				let path = "/search?q=".concat(this.search);

				this.$http.get(path)
				.then(function(response) {
					this.results = response.body;
					this.lastSearch = this.search;
					this.appendResults();
					this.loading = false;
				})
			},
			// appendResults
			appendResults: function () {
				if (this.products.length < this.results.length) {
					let toAppend = this.results.slice(this.products.length,
						LOAD_NUM + this.products.length);
					this.products = this.products.concat(toAppend);
				}
			}
		},
		/**/
		// Filters
		/**/
		filters: {
			currency: function(price) {
				return "$".concat(price.toFixed(2));
			}
		},
		/**/
		// Lifecycle hooks
		/**/
		// created
		created: function() {
			this.onSubmit();
		},
		// updated
		updated: function () {
			let sensor = document.querySelector("#product-list-bottom");
			watcher = scrollMonitor.create(sensor);
			watcher.enterViewport(this.appendResults);
		},
		// beforeUpdate
		beforeUpdate: function () {
			if (watcher) {
				watcher.destroy();
				watcher = null;
			}
		}
	});




