import { IOHandler } from '../lib/io-handler'
import { from, ZodRPC } from '../lib/zod-rpc'
import { z } from 'zod'

/**
 * @returns {{handler: IOHandler, transport: RPCTransport}}
 */
function testIo () {
    const transport = {
        send: jest.fn().mockReturnValue({ success: 'hello world' })
    }
    const handler = new IOHandler(transport)
    return { transport, handler }
}

describe('zod-rpc', () => {
    it('can send notification messages in old format', async () => {
        const { handler, transport } = testIo()
        await handler.notify(from('hello-world', { id: 1 }))
        expect(transport.send).toHaveBeenCalledTimes(1)
    })
    it('can perform request->response in old format', async () => {
        expect.assertions(2)
        const params = { id: 1 }
        const result = { a: 'b' }
        /** @type {RPCTransport} */
        const transport = {
            send: async (rpc) => {
                expect(rpc.params).toBe(params)
                return result
            }
        }
        const handler = new IOHandler(transport)
        const rpc = from('hello-world', params)
        const returnedResult = await handler.request(rpc)
        expect(returnedResult).toEqual(result)
    })
    describe('can send new messages', () => {
        it('when there is no validation', async () => {
            class T1 extends ZodRPC {
        method = 'abc';
            }
            const { handler, transport } = testIo()
            await handler.notify(new T1())
            expect(transport.send).toHaveBeenCalledTimes(1)
        })
        it('when there is params validation', async () => {
            expect.assertions(2)
            class T1 extends ZodRPC {
        method = 'abc';
        paramsValidator = z.string();
            }
            const { handler, transport } = testIo()
            try {
                await handler.notify(new T1(3))
            } catch (e) {
                expect(transport.send).toHaveBeenCalledTimes(0)
                expect(e.message).toMatchInlineSnapshot(`
          "1 SchemaValidationError(s) errors for T1
              Expected string, received number"
        `)
            }
        })
        it('when there is result validation', async () => {
            expect.assertions(2)
            class T1 extends ZodRPC {
        method = 'abc';
        resultValidator = z.string();
            }
            const { handler, transport } = testIo()
            try {
                await handler.request(new T1(3))
            } catch (e) {
                expect(transport.send).toHaveBeenCalledTimes(1)
                expect(e.message).toMatchInlineSnapshot(`
          "1 SchemaValidationError(s) errors for T1
              Expected string, received object"
        `)
            }
        })
    })
})
