import Ticket from '../Ticket'

it('should implement optimistic concurrency control', async function () {
    const ticket = await Ticket.build({
        title: 'T1',
        price: 5,
        userId: '123'
    }).save()

    const firstInstance = await Ticket.findById(ticket.id)
    const secondInstance = await Ticket.findById(ticket.id)

    firstInstance.set({price: 10})
    secondInstance.set({price: 10})

    await firstInstance.save()
})