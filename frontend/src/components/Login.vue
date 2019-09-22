<template>
    <el-row :gutter="20" v-if="!isLoggedIn" justify="center">
        <el-col :span="10">
            <h1 class="sub-title">Login</h1>
            <el-form 
                :model="form_login" 
                status-icon 
                :rules="rules_login" 
                ref="form_login" 
                label-width="200px">
                <el-form-item label="Username/Email" prop="username_or_email">
                    <el-input
                        id="login-username"
                        v-model="form_login.username_or_email">
                    </el-input>
                </el-form-item>
                <el-form-item label="Password" prop="password">
                    <el-input 
                        id="login-password"
                        type="password" 
                        v-model="form_login.password" 
                        auto-complete="off">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button 
                        type="primary" 
                        @click="submitForm('form_login')"
                        id="login-submit-btn" 
                        :loading="pendingLogin">
                        Login
                    </el-button>
                    <el-button @click="resetForm('form_login')">
                        Clear
                    </el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="10" align="center">
            <h1 class="sub-title">Registrar</h1>
            <el-form 
                v-if="!isRegistered" 
                :model="form_register" 
                status-icon 
                :rules="rules_register" 
                ref="form_register" 
                label-width="200px">
                <el-form-item label="Username" prop="username">
                    <el-input
                        id="register-username"
                        v-model="form_register.username">
                    </el-input>
                </el-form-item>
                <el-form-item label="Email Address" prop="email">
                    <el-input
                        id="register-email"
                        v-model="form_register.email">
                    </el-input>
                </el-form-item>
                <el-form-item label="Confirmation Email" prop="confirm_email">
                    <el-input
                        id="register-confirm-email"
                        v-model="form_register.confirm_email">
                    </el-input>
                </el-form-item>
                <el-form-item label="Password" prop="password">
                    <el-input 
                        id="register-password"
                        type="password" 
                        v-model="form_register.password" 
                        auto-complete="off">
                    </el-input>
                </el-form-item>
                <el-form-item label="Confirmation Password" prop="confirm_password">
                    <el-input 
                        id="register-confirm-password"
                        type="password" 
                        v-model="form_register.confirm_password" 
                        auto-complete="off">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button 
                        type="primary" 
                        @click="submitRegisterForm('form_register')"
                        id="register-submit-btn" 
                        :loading="pendingRegister">
                        Sign Up
                    </el-button>
                    <el-button @click="resetForm('form_register')">
                        Clear
                    </el-button>
                </el-form-item>
            </el-form>
            <el-progress 
                v-else 
                type="circle" 
                :percentage="100" 
                status="success"></el-progress>
        </el-col>
    </el-row>
</template>

<script>
import { mapGetters } from 'vuex';

const validateUsername = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('Enter your username'));
    } else {
        callback();
    }
};

const validateLoginPass = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('Enter your password'));
    } else {
        callback();
    }
};

export default {
    name: 'Login',
    data() {
        return {
            form_login: {
                username_or_email: '',
                password: '',
            },
            form_register: {
                username: '',
                email: '',
                confirm_email: '',
                password: '',
                confirm_password: '',

            },
            rules_login: {
                username_or_email: [
                    { validator: validateUsername, trigger: 'blur' },
                ],
                password: [
                    { validator: validateLoginPass, trigger: 'blur' },
                ],
            },
            rules_register: {
                username: [
                    { validator: validateUsername, trigger: 'blur' },
                ],
                email: [
                    { validator: this.validateEmail, trigger: 'blur' },
                ],
                confirm_email: [
                    { validator: this.validateEmail2, trigger: 'blur' },
                ],
                password: [
                    { validator: this.validatePass, trigger: 'blur' },
                ],
                confirm_password: [
                    { validator: this.validatePass2, trigger: 'blur' },
                ],
            },
        };
    },
    computed: {
        ...mapGetters([
            'isLoggedIn', 
            'pendingLogin',
            'isRegistered',
            'pendingRegister',
        ]),
    },
    methods: {
        validatePass(rule, value, callback) {
            if (value === '') {
                callback(new Error('Please input the password'));
            } else {
                if (this.form_register.confirm_password !== '') {
                    this.$refs.form_register.validateField('confirm_password');
                }
                callback();
            }
        },
        validatePass2(rule, value, callback) {
            if (value === '') {
                callback(new Error('Please input the password again'));
            } else if (value !== this.form_register.password) {
                callback(new Error('Passwords don\'t match!'));
            } else {
                callback();
            }
        },

        validateEmail(rule, value, callback) {
            if (value === '') {
                callback(new Error('Please input the email address'));
            } else {
                if (this.form_register.confirm_email !== '') {
                    this.$refs.form_register.validateField('confirm_email');
                }
                callback();
            }
        },

        validateEmail2(rule, value, callback) {
            if (value === '') {
                callback(new Error('Please input the email address again'));
            } else if (value !== this.form_register.email) {
                callback(new Error('Email Addresses don\'t match!'));
            } else {
                callback();
            }
        },
        submitForm(formName) {
            const { username_or_email, password } = this.form_login;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                this.$store.dispatch('login', {
                    username_or_email: username_or_email,
                    password: password,
                }).then(() => {
                    this.$router.push('/');
                });
                return true;
                }
                return false;
            });
        },
        submitRegisterForm(formName) {
            const { username, email, confirm_email, password, confirm_password } = this.form_register;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$store.dispatch('register', {
                        username: username,
                        email: email,
                        email2: confirm_email,
                        password: password,
                    });
                    return true;
                }
                return false;
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        logout() {
            this.$store.dispatch('logout');
        },
    },
};
</script>

<style>
.sub-title {
    text-align: center;
}
</style>