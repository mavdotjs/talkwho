<script>
	const { data, children } = $props()
	let dropdownOpen = $state(false)
	$inspect(dropdownOpen)
</script>

<div class="h-[100vh] w-[100vw] flex flex-col">
    <div class="px-4">
        <div class="navbar bg-base-200 rounded-b-xl">
            <div class="flex-1">
                <button class="btn btn-ghost text-xl">spiel.place</button>
            </div>
            <div class="flex-none">
                <details
                    class="dropdown dropdown-end"
                    ontoggle={({ newState }) => (dropdownOpen = newState === 'open')}>
                    <summary class="btn btn-circle btn-ghost m-1 swap swap-rotate">
                        <input type="checkbox" bind:checked={dropdownOpen} />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            class="size-5 swap-off">
                            <path
                                fill-rule="evenodd"
                                d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
                                clip-rule="evenodd"></path>
                        </svg>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="size-5 swap-on stroke-2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path>
                        </svg>
                    </summary>
                    <ul class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                        <li><a href="/app/settings">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            {data.displayName}
                        </a></li>
                        <li>
                            <a href="/auth/signout">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="size-6">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                                    ></path>
                                </svg>
                                sign out</a>
                        </li>
                    </ul>
                </details>
            </div>
        </div>
    </div>
    <div class="flex-grow">
        {@render children()}
    </div>
</div>