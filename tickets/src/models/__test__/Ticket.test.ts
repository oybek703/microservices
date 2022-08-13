import Ticket from '../Ticket'

it('should implement optimistic concurrency control', async function () {
    const ticket = await Ticket.build({
        title: 'T1',
        price: 5,
        userId: '123'
    }).save()

    const firstInstance = await Ticket.findById(ticket.id)
    const secondInstance = await Ticket.findById(ticket.id)

    firstInstance!.set({price: 10})
    secondInstance!.set({price: 10})
    await firstInstance!.save()
    try {
        await secondInstance!.save()
    } catch (e: any) {
        const errorMessage = e.message
        expect(errorMessage).toContain('No matching document found for id')
    }
})

it('should increment version number on multiple saves', async function () {
    const ticket = await Ticket.build({
        title: 'T1',
        price: 5,
        userId: '123'
    }).save()
    expect(ticket.version).toEqual(0)
    await ticket.save()
    expect(ticket.version).toEqual(1)
    await ticket.save()
    expect(ticket.version).toEqual(2)
})