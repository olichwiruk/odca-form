<template>
    <div class="controlItemWrapper" :class="control.className" :data-control-name="control.name">
        <div class="controlItem row" :class="{ onWarn: warned, onError: !valid }" :id="control.name" v-if="labelPosition === 'left'">
            <slot name="label"/>

            <div :class="inputClass" class="input-group">
                <input type="text" class="form-control"
                       :readonly="control.readonly"
                       :name="control.fieldName">

                <div class="input-group-append">
                        <span class="input-group-text">
                            <font-awesome-icon :icon="icon"></font-awesome-icon>
                        </span>
                </div>
            </div>

            <slot name="options"/>
            <slot name="information"/>
            <slot name="errors"/>
        </div>
        <div class="controlItem row" :id="control.name" v-else>
            <div class="form-group col-md-12">
                <label> {{control.label}} </label>
                <span v-show="control.required"> *</span>

                <div class="input-group">
                    <input type="text" class="form-control"
                           :readonly="control.readonly"
                           :name="control.fieldName">

                    <div class="input-group-append">
                        <span class="input-group-text">
                            <font-awesome-icon :icon="icon"></font-awesome-icon>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {CONTROL_TYPES} from "@/config/control_constant";
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

    export default {
        name: "DatePickerControl",
        props: ['control', 'labelPosition', 'inputClass', 'valid', 'warned'],
        components: {FontAwesomeIcon},
        data: () => ({
            $control: null,
            icon: CONTROL_TYPES.datepicker.icon
        }),
        watch: {
            "control.defaultValue": function(val) {
                if (!this.$control) {
                    return;
                }

                this.$control.val(val);
            }
        },
        methods: {
            configUpdated() {
                this.$control.datepicker("option", "dateFormat", this.control.dateFormat);
            }
        },
        mounted() {
            let self = this;
            this.$control = $(this.$el).find("input");
            this.$control.datepicker({
                dateFormat: this.control.dateFormat,
                beforeShow:function(input) {
                    // read only can't choose
                    if (self.control.readonly) {
                        return false;
                    }
                }
            });
        },
        beforeDestroy() {
            this.$control.datepicker('destroy');
        }
    }
</script>

<style scoped>

</style>
