<template>
    <b-container>
        <b-navbar toggleable="lg" type="dark" variant="info">

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
            
                    <b-nav-item-dropdown text="Group">
                        <b-dropdown-item to="/group/create">Create</b-dropdown-item>
                        <b-dropdown-item to="/group/list">List</b-dropdown-item>
                    </b-nav-item-dropdown>

                    <b-nav-item-dropdown text="Project">
                        <b-dropdown-item to="/project/create">Create</b-dropdown-item>
                        <b-dropdown-item to="/project/list">List</b-dropdown-item>
                    </b-nav-item-dropdown>
                    <b-nav-item to="/task/list">Tasks</b-nav-item>

                    <b-nav-item to="/user/me" right>Profile</b-nav-item>

                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </b-container>
</template>

<script>
export default {

}
</script>

<style>

</style>