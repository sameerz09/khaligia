odoo.define("sh_pos_theme_responsive.product_widget_control_panel", function(require) {

    const ProductsWidgetControlPanel = require("point_of_sale.ProductsWidgetControlPanel");
    const Registries = require("point_of_sale.Registries");
    const { useListener } = require("@web/core/utils/hooks");
    const { onMounted, onWillUnmount, useRef } = owl;

    const PosProductsWidgetControlPanel = (ProductsWidgetControlPanel) =>
        class extends ProductsWidgetControlPanel {
            setup() {
                super.setup();
                this.hide_searchbar = true;
                useListener("click-product-grid-view", this.onClickProductGridView);
                useListener("click-product-list-view", this.onClickProductListView);
                onMounted(() => {
                    if (this.env.pos.pos_theme_settings_data[0].sh_pos_switch_view == false) {
                        $(".sh_switch_view_icon").hide();
                    } else {
                        if (this.env.pos.product_view && this.env.pos.product_view == "list") {
                            $(".product_grid").hide();
                            $(".product_list").show();
                        } else {
                            $(".product_grid").show();
                            $(".product_list").hide();
                        }
                        if (this.env.pos.pos_theme_settings_data && this.env.pos.pos_theme_settings_data[0] && this.env.pos.pos_theme_settings_data[0].sh_default_view == "grid_view") {
                            $(".product_grid_view").addClass("highlight");
                            $(".product_list").hide();
                            $(".rightpane").removeClass("sh_right_pane");
                            this.env.pos.product_view = "grid";
                        } else if (this.env.pos.pos_theme_settings_data[0].sh_default_view == "list_view") {
                            $(".product_list_view").addClass("highlight");
                            $(".product_grid").hide();
                            $(".rightpane").addClass("sh_right_pane");
                            this.env.pos.product_view = "list";
                        }
                    }
                })
            }
            get imageUrl() {
                const product = this.props.product;
                return `/web/image?model=product.product&field=image_128&id=${product.id}&write_date=${product.write_date}&unique=1`;
            }
            sh_search_input() {
                if (this.hide_searchbar) {
                    this.hide_searchbar = false;
                    $('.icon').addClass('sh_open_search_bar')
                    this.render();
                } else {
                    this.hide_searchbar = true;
                    $('.icon').removeClass('sh_open_search_bar')
                    this.render();
                }
            }
            onClickProductGridView(event) {
                $($('.product-list')[0]).show()
                if ($(".product_list_view").hasClass("highlight")) {
                    $(".product_list_view").removeClass("highlight");
                    $(".product_grid_view").addClass("highlight");
                    $(".rightpane").removeClass("sh_right_pane");
                }
                this.env.pos.product_view = "grid";
                $(".product_grid").show();
                $(".product_list").hide();
                this.trigger("update-product-list");
            }
            onClickProductListView() {
                $($('.product-list')[0]).hide()
                if ($(".product_grid_view").hasClass("highlight")) {
                    $(".product_grid_view").removeClass("highlight");
                    $(".product_list_view").addClass("highlight");
                    $(".rightpane").addClass("sh_right_pane");
                }
                this.env.pos.product_view = "list";
                $(".product_grid").hide();
                $(".product_list").show();
                this.trigger("update-product-list");
            }
        };
    Registries.Component.extend(ProductsWidgetControlPanel, PosProductsWidgetControlPanel);

    return PosProductsWidgetControlPanel

});
