<script>
	import { api } from '$lib/apiclient'
    import { goto } from "$app/navigation"

    const { data } = $props()
    let roomname = $state('')

    async function createRoom() {
        const res = await api.rooms.create.$post({
            json: {
                name: roomname
            }
        })
        if(!res.ok) return
        const id = await res.text()
        goto(`/app/:${id}`)
    }
</script>

<div class="w-56 flex flex-col justify-center">
    <div class="my-10 px-2 py-2 rounded-r-lg bg-base-200">
        <span class="text-md font-bold mb-2">new room</span>
        <input bind:value={roomname} minlength=4 class="input input-bordered w-full placeholder:text-base-content/50 mb-2" type="text" placeholder="name">
        <button on:click={createRoom} class="btn btn-secondary w-full">create</button>
    </div>
</div>
<main class="flex-grow">
    list
</main>