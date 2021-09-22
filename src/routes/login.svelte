<!-- <script lang="ts">
	// import supabase from '$lib/db';
	import { disableGlobalShortcuts, user } from '$lib/stores';
	import '$lib/scss/utilities/center.scss';

	let loading = false;
	let email: string;

	const handleLogin = async () => {
		try {
			loading = true;
			const { error } = await supabase.auth.signIn({ email });
			if (error) throw error;
			alert('Check your email for the login link!');
		} catch (error) {
			alert(error.error_description || error.message);
		} finally {
			loading = false;
		}
	};

	const signOut = async () => {
		try {
			loading = true;
			let { error } = await supabase.auth.signOut();
			if (error) throw error;
		} catch (error) {
			alert(error.message);
		} finally {
			loading = false;
		}
	};
	user.set(supabase.auth.user());
	supabase.auth.onAuthStateChange((_, session) => {
		user.set(session.user);
	});

	$disableGlobalShortcuts = true;
</script>

<svelte:head><title>Login - Met Explorer</title></svelte:head>

<div class="center+ flow">
	{#if $user}
		<h2>You are Logged In</h2>

		<p>You are logged in as {$user.email}.</p>
		<button on:click={signOut} disabled={loading}>Sign Out</button>
	{:else}
		<h2>Log in to Save Your Items</h2>

		<p>Your information is never shared. Email will be used strictly for saving your images.</p>

		<form id="signup-form" on:submit|preventDefault={handleLogin}>
			<p>Sign in via a magic link sent to your email:</p>
			<input id="signup-username" type="email" required placeholder="Email" bind:value={email} />
			<input type="submit" value={loading ? 'Loading' : 'Send magic link'} disabled={loading} />
		</form>
	{/if}
</div> -->
